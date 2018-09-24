import progress from '../../services/progress';

export default async ctx => {
    ctx.body = progress.getProgress();
};
