import * as inspector from 'node:inspector';
import * as fs from 'node:fs';
import toobusy from 'toobusy-js';
import getLogger from './services/logger';

const logger = getLogger();

export interface CpuLagProfilerConfig {
    enabled: boolean;
    lagThresholdMs?: number;
    minIntervalBetweenDumpsMs?: number;
    dumpDir?: string;
    samplingIntervalUs?: number;
    checkIntervalMs?: number;
}

const DEFAULTS: Required<Omit<CpuLagProfilerConfig, 'enabled'>> = {
    lagThresholdMs: 100,
    minIntervalBetweenDumpsMs: 60_000,
    dumpDir: '/tmp',
    samplingIntervalUs: 200,
    checkIntervalMs: 1000,
};

let session: inspector.Session | null = null;
let checkTimer: NodeJS.Timeout | null = null;
let lastDump = 0;

export function startCpuLagProfiler(config: CpuLagProfilerConfig): void {
    if (!config.enabled) return;

    if (session) {
        logger.warn('[cpuLagProfiler] déjà démarré, appel ignoré');
        return;
    }

    const opts = { ...DEFAULTS, ...config };

    session = new inspector.Session();
    session.connect();

    startProfiling(opts.samplingIntervalUs);

    checkTimer = setInterval(() => {
        const lag = toobusy.lag();
        const now = Date.now();

        if (
            lag > opts.lagThresholdMs &&
            now - lastDump > opts.minIntervalBetweenDumpsMs
        ) {
            lastDump = now;
            dumpProfile(opts.dumpDir, opts.samplingIntervalUs);
        }
    }, opts.checkIntervalMs);

    logger.info(
        `[cpuLagProfiler] actif (seuil=${opts.lagThresholdMs}ms, dossier=${opts.dumpDir})`,
    );
}

export function stopCpuLagProfiler(): void {
    if (checkTimer) {
        clearInterval(checkTimer);
        checkTimer = null;
    }
    if (session) {
        session.post('Profiler.stop', () => {
            session?.disconnect();
            session = null;
        });
    }
}

function startProfiling(samplingIntervalUs: number): void {
    if (!session) return;
    session.post(
        'Profiler.setSamplingInterval',
        { interval: samplingIntervalUs },
        (err) => {
            if (err)
                logger.error(
                    '[cpuLagProfiler] erreur setSamplingInterval',
                    err,
                );
        },
    );
    session.post('Profiler.enable', (err) => {
        if (err) return logger.error('[cpuLagProfiler] erreur enable', err);
        session?.post('Profiler.start', (err2) => {
            if (err2) logger.error('[cpuLagProfiler] erreur start', err2);
        });
    });
}

function dumpProfile(dumpDir: string, samplingIntervalUs: number): void {
    if (!session) return;
    session.post('Profiler.stop', (err, params) => {
        if (err || !params) {
            logger.error('[cpuLagProfiler] erreur stop profiler', err);
            return;
        }
        const path = `${dumpDir}/incident-${Date.now()}.cpuprofile`;
        try {
            fs.writeFileSync(path, JSON.stringify(params.profile));
            logger.warn(`[cpuLagProfiler] profil écrit: ${path}`);
        } catch (writeErr) {
            logger.error('[cpuLagProfiler] erreur écriture profil', writeErr);
        }

        // relance pour couvrir la fenêtre suivante
        startProfiling(samplingIntervalUs);
    });
}
