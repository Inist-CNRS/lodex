import * as inspector from 'node:inspector';
import * as fs from 'node:fs';
import getLogger from './services/logger';

export interface CpuLagProfilerConfig {
    enabled: boolean;
    minIntervalBetweenDumpsMs?: number;
    rotateIntervalMs?: number; // borne la fenêtre captée
    dumpDir?: string;
    samplingIntervalUs?: number;
}

type ActiveOpts = Required<Omit<CpuLagProfilerConfig, 'enabled'>>;

const DEFAULTS: ActiveOpts = {
    minIntervalBetweenDumpsMs: 60_000,
    rotateIntervalMs: 5_000,
    dumpDir: '/tmp',
    samplingIntervalUs: 1_000,
};

const MAX_KEPT_PROFILES = 20;

let session: inspector.Session | null = null;
let rotateTimer: NodeJS.Timeout | null = null;
let lastDump = 0;
let stopInFlight = false;
let dumpPending = false;
let activeOpts: ActiveOpts = DEFAULTS;

const positive = (value: unknown, fallback: number): number =>
    typeof value === 'number' && Number.isFinite(value) && value > 0
        ? value
        : fallback;

function buildOpts(config: CpuLagProfilerConfig): ActiveOpts {
    return {
        minIntervalBetweenDumpsMs: positive(
            config.minIntervalBetweenDumpsMs,
            DEFAULTS.minIntervalBetweenDumpsMs,
        ),
        rotateIntervalMs: positive(
            config.rotateIntervalMs,
            DEFAULTS.rotateIntervalMs,
        ),
        samplingIntervalUs: positive(
            config.samplingIntervalUs,
            DEFAULTS.samplingIntervalUs,
        ),
        dumpDir:
            typeof config.dumpDir === 'string' && config.dumpDir
                ? config.dumpDir
                : DEFAULTS.dumpDir,
    };
}

export function startCpuLagProfiler(config: CpuLagProfilerConfig): void {
    if (!config.enabled) return;

    const logger = getLogger();

    if (session) {
        logger.warn('[cpuLagProfiler] déjà démarré, appel ignoré');
        return;
    }

    activeOpts = buildOpts(config);

    session = new inspector.Session();
    session.connect();
    startProfiling(activeOpts.samplingIntervalUs);

    rotateTimer = setInterval(() => {
        try {
            rotateProfilingWindow(activeOpts.samplingIntervalUs);
        } catch (e) {
            getLogger().error('[cpuLagProfiler] erreur rotation', e);
        }
    }, activeOpts.rotateIntervalMs);
    rotateTimer.unref();

    logger.info(
        `[cpuLagProfiler] actif (dossier=${activeOpts.dumpDir}, rotation=${activeOpts.rotateIntervalMs}ms, échantillonnage=${activeOpts.samplingIntervalUs}µs)`,
    );
}

export function stopCpuLagProfiler(): void {
    if (rotateTimer) {
        clearInterval(rotateTimer);
        rotateTimer = null;
    }
    if (!session) return;
    const s = session;
    session = null; // les timers et callbacks deviennent des no-op
    try {
        s.post('Profiler.stop', () => {
            try {
                s.disconnect();
            } catch {
                /* déjà déconnectée */
            }
        });
    } catch {
        try {
            s.disconnect();
        } catch {
            /* déjà déconnectée */
        }
    }
}

/**
 * À appeler depuis le callback `blocked-at` existant dans app.js.
 */
export function onBlockedEvent(): void {
    if (!session || stopInFlight || dumpPending) return;
    const now = Date.now();
    if (now - lastDump < activeOpts.minIntervalBetweenDumpsMs) return;
    lastDump = now;
    dumpPending = true; // empêche la rotation de jeter la fenêtre du blocage
    // on sort du contexte du hook async avant de toucher à l'inspector
    setImmediate(() => {
        try {
            dumpProfile(activeOpts.dumpDir, activeOpts.samplingIntervalUs);
        } catch (e) {
            getLogger().error('[cpuLagProfiler] dump impossible', e);
        } finally {
            dumpPending = false;
        }
    });
}

function startProfiling(samplingIntervalUs: number): void {
    if (!session) return;
    const logger = getLogger();
    try {
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
            try {
                session?.post('Profiler.start', (err2) => {
                    if (err2)
                        logger.error('[cpuLagProfiler] erreur start', err2);
                });
            } catch (e) {
                logger.error('[cpuLagProfiler] start impossible', e);
            }
        });
    } catch (e) {
        logger.error('[cpuLagProfiler] démarrage impossible', e);
    }
}

function safeStop(cb: (err: Error | null, profile?: unknown) => void): void {
    if (!session || stopInFlight) return;
    stopInFlight = true;
    try {
        session.post('Profiler.stop', (err, params) => {
            stopInFlight = false;
            cb(err ?? null, params?.profile);
        });
    } catch (e) {
        // erreur synchrone (ex: profil trop gros) : on libère le verrou
        stopInFlight = false;
        getLogger().error('[cpuLagProfiler] Profiler.stop a échoué', e);
        resetProfiler();
        cb(e as Error);
    }
}

/** Repart d'un état propre après un échec. */
function resetProfiler(): void {
    if (!session) return;
    try {
        session.post('Profiler.disable', () => {
            startProfiling(activeOpts.samplingIntervalUs);
        });
    } catch (e) {
        getLogger().error('[cpuLagProfiler] reset impossible', e);
    }
}

/** Rotation silencieuse : jette la fenêtre si aucun blocage ne l'a réclamée. */
function rotateProfilingWindow(samplingIntervalUs: number): void {
    if (dumpPending) return;
    safeStop((err) => {
        if (!err) startProfiling(samplingIntervalUs);
    });
}

function pruneOldProfiles(dir: string): void {
    try {
        const files = fs
            .readdirSync(dir)
            .filter(
                (f) => f.startsWith('incident-') && f.endsWith('.cpuprofile'),
            )
            .sort();
        files
            .slice(0, Math.max(0, files.length - MAX_KEPT_PROFILES))
            .forEach((f) => fs.unlinkSync(`${dir}/${f}`));
    } catch {
        /* la rétention ne doit jamais gêner le diagnostic */
    }
}

function dumpProfile(dumpDir: string, samplingIntervalUs: number): void {
    safeStop((err, profile) => {
        if (err || !profile) return;
        const path = `${dumpDir}/incident-${Date.now()}.cpuprofile`;
        try {
            fs.writeFileSync(path, JSON.stringify(profile));
            getLogger().warn(`[cpuLagProfiler] profil écrit: ${path}`);
            pruneOldProfiles(dumpDir);
        } catch (writeErr) {
            getLogger().error(
                '[cpuLagProfiler] erreur écriture profil',
                writeErr,
            );
        }
        startProfiling(samplingIntervalUs);
    });
}
