import progress from '../../services/progress';

export default async (ctx: any) => {
    ctx.body = progress.getProgress(ctx.tenant);
};
