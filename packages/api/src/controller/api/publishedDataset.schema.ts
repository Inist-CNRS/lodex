import { z } from 'zod';

export const filterSchema = z.object({
    fieldName: z.string().regex(/^[a-zA-Z0-9_]{4}$/),
    value: z.string().or(z.array(z.string())).or(z.number()).nullish(),
});

export const searchSchema = z.object({
    filters: filterSchema.array().optional(),
    page: z
        .number()
        .nullish()
        .transform((val) => val ?? 0),
    perPage: z
        .number()
        .nullish()
        .transform((val) => val ?? 10),
    sort: z
        .object({
            sortBy: z.string(),
            sortDir: z
                .enum(['ASC', 'DESC'])
                .nullish()
                .transform((val) => val ?? 'ASC'),
        })
        .nullish()
        .transform((value) => value || undefined),
});

export type Filter = z.infer<typeof filterSchema>;
