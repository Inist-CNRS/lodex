import { ProgressStatus } from '@lodex/common';

export class Progress {
    listeners = [];

    initialize(tenant: any) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (this[tenant]) {
            return;
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant] = {
            status: ProgressStatus.PENDING,
        };
    }

    start(tenant: any, { status, target, symbol, label, subLabel, type }: any) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (!this[tenant]) {
            this.initialize(tenant);
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].status = status;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].target = target;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].progress = 0;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].symbol = symbol;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].label = label;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].error = null;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].type = type;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].subLabel = subLabel;
        this.notifyListeners(tenant);
    }

    finish(tenant: any) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (!this[tenant] || this[tenant].status === ProgressStatus.ERROR) {
            return;
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].status = ProgressStatus.PENDING;
        this.notifyListeners(tenant);
    }

    throw(tenant: any, error: any) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].status = ProgressStatus.ERROR;
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].error = error;
    }

    incrementProgress(tenant: any, progress = 1) {
        if (
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[tenant].status === ProgressStatus.PENDING ||
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[tenant].status === ProgressStatus.ERROR
        ) {
            return;
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].progress += progress;
        this.notifyListeners(tenant);
    }

    setProgress(tenant: any, progress: any) {
        if (
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[tenant].status === ProgressStatus.PENDING ||
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[tenant].status === ProgressStatus.ERROR
        ) {
            return;
        }

        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this[tenant].progress = progress;
        this.notifyListeners(tenant);
    }

    getProgress(tenant: any) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (this[tenant].status === ProgressStatus.ERROR) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const error = this[tenant].error;
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[tenant].error = null;
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this[tenant].status = ProgressStatus.PENDING;
            throw error;
        }

        return {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            status: this[tenant].status,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            target: this[tenant].target,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            progress: this[tenant].progress,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            symbol: this[tenant].symbol,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            error: this[tenant].error,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            label: this[tenant].label,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            subLabel: this[tenant].subLabel,
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            type: this[tenant].type,
            isBackground: [
                ProgressStatus.PUBLISH_DOCUMENT,
                ProgressStatus.UNPUBLISH_DOCUMENT,
                ProgressStatus.ENRICHING,
                ProgressStatus.PUBLISH_FACET,
                ProgressStatus.CREATE_INDEX,
                ProgressStatus.SAVING_DATASET,
                ProgressStatus.INDEXATION,
                // @ts-expect-error TS(2339): Property 'includes' does not exist on type '{}'.
            ].includes(this[tenant].status),
        };
    }

    addProgressListener = (listener: any) => {
        // @ts-expect-error TS(2339): Property 'push' does not exist on type '{}'.
        this.listeners.push(listener);
    };

    notifyListeners = (tenant: any) => {
        this.listeners.forEach((listener: any) =>
            listener({
                room: `${tenant}-progress`,
                data: this.getProgress(tenant),
            }),
        );
    };
}

export default new Progress();
