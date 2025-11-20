import { z } from 'zod';

export const previewDataSourceSchema = z.object({
    dataSource: z.string(),
    sourceColumn: z.string().nullish(),
    subPath: z.string().nullish(),
    rule: z.string().nullish(),
});

export type PreviewDataSourceInput = z.infer<typeof previewDataSourceSchema>;
