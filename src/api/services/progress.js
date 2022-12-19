import {
    PENDING,
    ERROR,
    PUBLISH_DOCUMENT,
    ENRICHING,
    PUBLISH_FACET,
    CREATE_INDEX,
    UNPUBLISH_DOCUMENT,
    SAVING_DATASET,
    INDEXATION,
} from '../../common/progressStatus';

export class Progress {
    listeners = [];
    status = PENDING;

    initialize(tenant) {
        if (!this[tenant]) {
            this[tenant] = {
                status: PENDING,
            };
        }
    }

    start(tenant, { status, target, symbol, label, subLabel, type }) {
        this[tenant].status = status;
        this[tenant].target = target;
        this[tenant].progress = 0;
        this[tenant].symbol = symbol;
        this[tenant].label = label;
        this[tenant].error = null;
        this[tenant].type = type;
        this[tenant].subLabel = subLabel;
        this.notifyListeners(tenant);
    }

    finish(tenant) {
        if (this[tenant].status === ERROR) {
            return;
        }
        this[tenant].status = PENDING;
        this.notifyListeners(tenant);
    }

    throw(tenant, error) {
        this[tenant].status = ERROR;
        this[tenant].error = error;
    }

    incrementProgress(tenant, progress = 1) {
        if (this[tenant].status === PENDING || this[tenant].status === ERROR) {
            return;
        }
        this[tenant].progress += progress;
        this.notifyListeners(tenant);
    }

    setProgress(tenant, progress) {
        if (this[tenant].status === PENDING || this[tenant].status === ERROR) {
            return;
        }

        this[tenant].progress = progress;
        this.notifyListeners(tenant);
    }

    getProgress(tenant) {
        if (this[tenant].status === ERROR) {
            const error = this[tenant].error;
            this[tenant].error = null;
            this[tenant].status = PENDING;
            throw error;
        }

        return {
            status: this[tenant].status,
            target: this[tenant].target,
            progress: this[tenant].progress,
            symbol: this[tenant].symbol,
            error: this[tenant].error,
            label: this[tenant].label,
            subLabel: this[tenant].subLabel,
            type: this[tenant].type,
            isBackground: [
                PUBLISH_DOCUMENT,
                UNPUBLISH_DOCUMENT,
                ENRICHING,
                PUBLISH_FACET,
                CREATE_INDEX,
                SAVING_DATASET,
                INDEXATION,
            ].includes(this[tenant].status),
        };
    }

    addProgressListener = listener => {
        this.listeners.push(listener);
    };

    notifyListeners = tenant => {
        this.listeners.forEach(listener => listener(this.getProgress(tenant)));
    };
}

export default new Progress();
