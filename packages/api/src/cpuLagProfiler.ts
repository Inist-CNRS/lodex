import * as inspector from 'node:inspector';
import * as fs from 'node:fs';
import getLogger from './services/logger';
export interface CpuLagProfilerConfig {
    enabled: boolean;
    minIntervalBetweenDumpsMs?: number;
    dumpDir?: string;
    samplingIntervalUs?: number;
}

const DEFAULTS: Required<Omit<CpuLagProfilerConfig, 'enabled'>> = {
    minIntervalBetweenDumpsMs: 60_000,
    dumpDir: '/tmp',
    samplingIntervalUs: 200,
};

let session: inspector.Session | null = null;
let lastDump = 0;
let activeOpts: Required<Omit<CpuLagProfilerConfig, 'enabled'>> = DEFAULTS;

export function startCpuLagProfiler(config: CpuLagProfilerConfig): void {
    if (!config.enabled) return;

    const logger = getLogger();

    if (session) {
        logger.warn('[cpuLagProfiler] déjà démarré, appel ignoré');
        return;
    }

    activeOpts = { ...DEFAULTS, ...config };

    session = new inspector.Session();
    session.connect();
    startProfiling(activeOpts.samplingIntervalUs);

    logger.info(`[cpuLagProfiler] actif (dossier=${activeOpts.dumpDir})`);
}

export function stopCpuLagProfiler(): void {
    if (session) {
        session.post('Profiler.stop', () => {
            session?.disconnect();
            session = null;
        });
    }
}

/**
 * À appeler depuis le callback `blocked-at` existant dans app.js.
 * Ne fait rien si le profiler n'est pas actif, ou si on est encore
 * dans la fenêtre anti-spam depuis le dernier dump.
 */
export function onBlockedEvent(): void {
    if (!session) return;

    const now = Date.now();
    if (now - lastDump < activeOpts.minIntervalBetweenDumpsMs) return;

    lastDump = now;
    dumpProfile(activeOpts.dumpDir, activeOpts.samplingIntervalUs);
}

function startProfiling(samplingIntervalUs: number): void {
    if (!session) return;
    const logger = getLogger();
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
    const logger = getLogger();
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
