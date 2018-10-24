import { PENDING } from '../../common/progressStatus';

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
    }

    finish() {
        this.status = PENDING;
    }

    checkProgress() {
        if (this.progress >= this.target) {
            this.status = PENDING;
        }
    }

    incrementProgress(progress = 1) {
        if (this.status === PENDING) {
            return;
        }
        this.progress += progress;
        this.checkProgress();
    }

    setProgress(progress) {
        if (this.status === PENDING) {
            return;
        }

        this.progress = progress;
        this.checkProgress();
    }

    incrementTarget(target = 1) {
        if (this.status === PENDING) {
            return;
        }

        this.target += target;
    }

    getProgress() {
        return {
            status: this.status,
            target: this.target,
            progress: this.progress,
            symbol: this.symbol,
        };
    }
}

export default new Progress();
