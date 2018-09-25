export class Progress {
    status = 'pending';
    start(status, target) {
        this.status = status;
        this.target = target;
        this.progress = 0;
    }
    finish() {
        this.status = 'pending';
    }

    incrementProgress(progress) {
        if (this.status === 'pending') {
            return;
        }
        this.progress += progress;
        if (this.progress >= this.target) {
            this.status = 'pending';
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
