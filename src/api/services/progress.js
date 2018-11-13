import { PENDING, ERROR } from '../../common/progressStatus';

export class Progress {
    status = PENDING;
    start(status, target, symbol) {
        if (target === null || target === undefined) {
            return;
        }

        this.status = status;
        this.target = target;
        this.progress = 0;
        this.symbol = symbol;
        this.error = null;
    }

    finish() {
        if (this.status === ERROR) {
            return;
        }
        this.status = PENDING;
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
    }

    setProgress(progress) {
        if (this.status === PENDING || this.status === ERROR) {
            return;
        }

        this.progress = progress;
    }

    incrementTarget(target = 1) {
        if (this.status === PENDING || this.status === ERROR) {
            return;
        }

        this.target += target;
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
        };
    }
}

export default new Progress();
