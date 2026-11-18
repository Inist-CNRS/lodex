// Once an ezs pipeline failed, @ezs/core (Feed.flow, once('error')) no longer
// listens to its errors. A statement still running then, as a source stalled
// by the dead pipeline after it, reports its next error (its "no data for
// N milliseconds" timeout, minutes later) on a stream nobody listens to: it
// comes out as an uncaught exception. Only that pipeline is dead, the
// process is fine and must not stop the other jobs.
// ponytail: a guard on the symptom, the fix belongs to @ezs/core Feed.flow
export const isAbandonedEzsPipelineError = (error: unknown) =>
    // set by ezs Feed.stop: the error of a statement, not of the code
    (error as { scope?: unknown } | null)?.scope === 'statements';
