import chunk from 'lodash/chunk';
import { z } from 'zod';
import { getCreatedCollection } from './utils';
import type { Db, Collection, Filter, Document } from 'mongodb';

// Schémas de validation Zod
const FindLimitFromSkipSchema = z.object({
    limit: z.number().int().positive(),
    skip: z.number().int().nonnegative(),
    filters: z.custom<Filter<Document>>(),
    sortBy: z.string().optional().default('count'),
    sortDir: z.enum(['ASC', 'DESC']).optional().default('DESC'),
});

const FindValuesForFieldSchema = z.object({
    field: z.string(),
    filter: z.string().optional(),
    page: z.number().int().nonnegative().optional().default(0),
    perPage: z.number().int().positive().max(100).optional().default(10),
    sortBy: z.string().optional(),
    sortDir: z.enum(['ASC', 'DESC']).optional(),
});

// Définition des types dérivés de Zod
type FindLimitFromSkipParams = z.infer<typeof FindLimitFromSkipSchema>;
type FindValuesForFieldParams = z.infer<typeof FindValuesForFieldSchema>;

interface AccentMap {
    [key: string]: string;
}

interface RegexFilter {
    $regex: string;
    $options: string;
}

interface FacetValue {
    value: string;
    count: number;
    [key: string]: unknown;
}

// Interface étendue pour la collection personnalisée
interface PublishedFacetCollection extends Collection {
    insertBatch: (documents: Document[]) => Promise<void>;
    insertFacet: (field: string, values: FacetValue[]) => Promise<void>;
    findLimitFromSkip: (params: FindLimitFromSkipParams) => Promise<Document[]>;
    findValuesForField: (
        params: FindValuesForFieldParams,
    ) => Promise<Document[]>;
    countValuesForField: (field: string, filter?: string) => Promise<number>;
}

export default async (db: Db): Promise<PublishedFacetCollection> => {
    const collection = (await getCreatedCollection(
        db,
        'publishedFacet',
    )) as PublishedFacetCollection;

    /**
     * Table de correspondance lettres → regex accent-insensible
     */
    const accentMap: AccentMap = {
        a: '[aàáâãäåāăą]',
        e: '[eèéêëēĕėęě]',
        i: '[iìíîïīĭįı]',
        o: '[oòóôõöøōŏő]',
        u: '[uùúûüūŭůűų]',
        c: '[cçćĉċč]',
        n: '[nñńņňŋ]',
        y: '[yýÿŷ]',
        s: '[sßśŝşš]',
        z: '[zźżž]',
        l: '[lĺļľłŀ]',
        r: '[rŕŗř]',
        t: '[tţťŧ]',
        d: '[dđď]',
        g: '[gĝğġģ]',
        h: '[hĥħ]',
        j: '[jĵ]',
        k: '[kķĸ]',
        w: '[wŵ]',
    };

    const escapeRegex = (char: string) =>
        char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const toAccentInsensitive = (text: string): string =>
        text
            .split('')
            .map((c: string) => accentMap[c] ?? escapeRegex(c))
            .join('');

    /**
     * Crée une regex accent-insensible qui trouve le terme n'importe où dans la chaîne
     *
     * @param {string} filter - Le terme de recherche
     * @returns {Object|null} - Un filtre regex MongoDB
     *
     */
    const createAccentInsensitiveContainsRegex = (
        filter: string,
    ): RegexFilter | null => {
        if (!filter) return null;

        const normalized = filter
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim();

        if (!normalized) return null;

        // Multi-mots → tous les mots doivent être présents
        if (normalized.includes(' ')) {
            const words = normalized.split(/\s+/).filter(Boolean);

            const wordPatterns = words.map((word) =>
                escapeRegex(toAccentInsensitive(word)),
            );

            const lookaheadPattern = wordPatterns
                .map((pattern) => `(?=.*${pattern})`)
                .join('');

            return {
                $regex: `^${lookaheadPattern}.*`,
                $options: 'i',
            };
        }

        // Mot simple → recherche "contains"
        return {
            $regex: escapeRegex(toAccentInsensitive(normalized)),
            $options: 'i',
        };
    };

    /**
     * Insertions par lot
     */
    collection.insertBatch = async (documents: Document[]): Promise<void> => {
        for (const data of chunk(documents, 100)) {
            await collection.insertMany(data);
        }
    };

    collection.insertFacet = async (
        field: string,
        values: FacetValue[],
    ): Promise<void> => {
        await collection.insertBatch(
            values.map((value: FacetValue) => ({ field, ...value })),
        );
    };

    /**
     * Récupère une page de résultats avec skip/limit/sort
     */
    collection.findLimitFromSkip = async (
        params: FindLimitFromSkipParams,
    ): Promise<Document[]> => {
        const validatedParams = FindLimitFromSkipSchema.parse(params);

        return collection
            .find(validatedParams.filters)
            .skip(validatedParams.skip)
            .limit(validatedParams.limit)
            .sort({
                [validatedParams.sortBy]:
                    validatedParams.sortDir === 'ASC' ? 1 : -1,
                _id: 1,
            })
            .toArray();
    };

    collection.findValuesForField = async (
        params: FindValuesForFieldParams,
    ): Promise<Document[]> => {
        const validatedParams = FindValuesForFieldSchema.parse(params);
        const filters: Filter<Document> = { field: validatedParams.field };

        if (validatedParams.filter?.trim()) {
            const regexFilter = createAccentInsensitiveContainsRegex(
                validatedParams.filter.trim(),
            );
            if (regexFilter) {
                filters.value = regexFilter;
            }
        }

        return collection.findLimitFromSkip({
            limit: validatedParams.perPage,
            skip: validatedParams.page * validatedParams.perPage,
            filters,
            sortBy: validatedParams.sortBy ?? 'count',
            sortDir: validatedParams.sortDir ?? 'DESC',
        });
    };

    collection.countValuesForField = async (
        field: string,
        filter?: string,
    ): Promise<number> => {
        const filters: Filter<Document> = { field };
        if (filter?.trim()) {
            const regexFilter = createAccentInsensitiveContainsRegex(
                filter.trim(),
            );
            if (regexFilter) {
                filters.value = regexFilter;
            }
        }
        return collection.countDocuments(filters);
    };

    return collection;
};
