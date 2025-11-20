import { z } from 'zod';

export const fieldNameSchema = z.string().regex(/^[a-zA-Z0-9]{4}$/);

export const getPageByFieldSchema = z.object({
    value: z.string().or(z.number()).nullish(),
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
        .transform((value) => value ?? { sortBy: '_id', sortDir: 'ASC' }),
});
