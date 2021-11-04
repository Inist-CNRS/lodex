import Queue from 'bull';

export const publisherQueue = new Queue('publisher', process.env.REDIS_URL);

publisherQueue.process((job, done) => {
    setTimeout(() => {
        console.log('JOB DONE', job.data);
        done();
    }, 10000);
});
