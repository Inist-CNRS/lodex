import { PENDING } from '../../common/progressStatus';

export class Progress {
    status = PENDING;
    start(status, target) {
        this.status = status;
        this.target = target;
        this.progress = 0;
    }
    finish() {
        this.status = PENDING;
    }

    incrementProgress(progress) {
        if (this.status === PENDING) {
            return;
        }
        this.progress += progress;
        if (this.progress >= this.target) {
            this.status = PENDING;
        }
    }

    getProgress() {
        return {
            status: this.status,
            target: this.target,
            progress: this.progress,
        };
    }
}

export default new Progress();
