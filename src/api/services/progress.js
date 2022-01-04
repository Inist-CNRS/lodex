import {
    PENDING,
    ERROR,
    PUBLISH_DOCUMENT,
    ENRICHING,
    PUBLISH_FACET,
    CREATE_INDEX,
} from '../../common/progressStatus';

export class Progress {
    listeners = [];
    status = PENDING;
    start({ status, target, symbol, label, subLabel, type }) {
        this.status = status;
        this.target = target;
        this.progress = 0;
        this.symbol = symbol;
        this.label = label;
        this.error = null;
        this.type = type;
        this.subLabel = subLabel;
        this.notifyListeners();
    }

    finish() {
        if (this.status === ERROR) {
            return;
        }
        this.status = PENDING;
        this.notifyListeners();
    }

    throw(error) {
        this.status = ERROR;
        this.error = error;
    }

    incrementProgress(progress = 1) {
        if (this.status === PENDING || this.status === ERROR) {
            return;
        }
        this.progress += progress;
        this.notifyListeners();
    }

    setProgress(progress) {
        if (this.status === PENDING || this.status === ERROR) {
            return;
        }

        this.progress = progress;
        this.notifyListeners();
    }

    incrementTarget(target = 1) {
        if (this.status === PENDING || this.status === ERROR) {
            return;
        }

        this.target += target;
        this.notifyListeners();
    }

    getProgress() {
        if (this.status === ERROR) {
            const error = this.error;
            this.error = null;
            this.status = PENDING;
            throw error;
        }

        return {
            status: this.status,
            target: this.target,
            progress: this.progress,
            symbol: this.symbol,
            error: this.error,
            label: this.label,
            subLabel: this.subLabel,
            type: this.type,
            isBackground: [
                PUBLISH_DOCUMENT,
                ENRICHING,
                PUBLISH_FACET,
                CREATE_INDEX,
            ].includes(this.status),
        };
    }

    addProgressListener = listener => {
        this.listeners.push(listener);
    };

    notifyListeners = () => {
        this.listeners.forEach(listener => listener(this.getProgress()));
    };
}

export default new Progress();
