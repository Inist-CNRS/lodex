export class Progress {
    status = 'pending';
    startPublishing(target) {
        this.status = 'publishing';
        this.target = target;
        this.progress = 0;
    }
    finishPublishing() {
        this.status = 'done';
    }

    incrementProgress(progress) {
        if (this.status !== 'publishing') {
            return;
        }
        this.progress += progress;
        if (this.progress >= this.target) {
            this.status = 'done';
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
