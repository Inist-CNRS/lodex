// Once an ezs pipeline failed, @ezs/core (Feed.flow, once('error')) no longer
// listens to its errors. A source statement stalled by the dead pipeline
// after it still has its timer: minutes later, its "no data for N
// milliseconds" timeout comes out on a stream nobody listens to, as an
// uncaught exception. Only that pipeline is dead, the process is fine and
// must not stop the other jobs.
// ponytail: a guard on the symptom, until Inist-CNRS/ezs#586 fixes Feed.flow
export const isAbandonedEzsPipelineError = (error: unknown) => {
    const { scope, message } =
        (error as { scope?: unknown; message?: unknown } | null) ?? {};
    // scope: set by ezs Feed.stop on any statement error; the message is the
    // one of the Feed.flow timer only
    return (
        scope === 'statements' &&
        typeof message === 'string' &&
        /has not received any data for/.test(message)
    );
};
