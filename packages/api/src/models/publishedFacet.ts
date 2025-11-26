import chunk from 'lodash/chunk';
import { getCreatedCollection } from './utils';
import type { Db, Collection, Filter, Document } from 'mongodb';

// Définition des types
interface AccentMap {
    [key: string]: string;
}

interface FindLimitFromSkipParams {
    limit: number;
    skip: number;
    filters: Filter<Document>;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
}

interface FindValuesForFieldParams {
    field: string;
    filter?: string;
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
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

    const escapeRegex = (char: string): string =>
        char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const toAccentInsensitive = (text: string): string =>
        text
            .split('')
            .map((c: string) => accentMap[c] || escapeRegex(c))
            .join('');

    /**
     * Crée une regex accent-insensible qui trouve le terme n'importe où dans la chaîne
     *
     * @param {string} filter - Le terme de recherche
     * @returns {Object|null} - Un filtre regex MongoDB
     *
     */
    const createWordStartRegex = (filter: string): RegexFilter | null => {
        if (!filter) return null;

        const normalized = filter
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim();

        if (!normalized) return null;

        if (normalized.includes(' ')) {
            // multi-mots
            const words = normalized.split(/\s+/).filter(Boolean);
            const wordPatterns = words.map((word: string) =>
                toAccentInsensitive(word),
            );
            const patterns = wordPatterns
                .map((pattern: string) => `(?=.*${pattern})`)
                .join('');
            return {
                $regex: `${patterns}.*`,
                $options: 'i',
            };
        }

        // mot simple
        return {
            $regex: `.*${toAccentInsensitive(normalized)}.*`,
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
    collection.findLimitFromSkip = async ({
        limit,
        skip,
        filters,
        sortBy = 'count',
        sortDir = 'DESC',
    }: FindLimitFromSkipParams): Promise<Document[]> => {
        return await collection
            .find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortDir === 'ASC' ? 1 : -1, _id: 1 })
            .toArray();
    };

    collection.findValuesForField = async ({
        field,
        filter,
        page = 0,
        perPage = 10,
        sortBy,
        sortDir,
    }: FindValuesForFieldParams): Promise<Document[]> => {
        const filters: Filter<Document> = { field };
        if (filter?.trim()) {
            const regexFilter = createWordStartRegex(filter.trim());
            if (regexFilter) {
                filters.value = regexFilter;
            }
        }

        return collection.findLimitFromSkip({
            limit: parseInt(perPage.toString(), 10),
            skip: (page || 0) * perPage,
            filters,
            sortBy,
            sortDir,
        });
    };

    collection.countValuesForField = async (
        field: string,
        filter?: string,
    ): Promise<number> => {
        const filters: Filter<Document> = { field };
        if (filter?.trim()) {
            const regexFilter = createWordStartRegex(filter.trim());
            if (regexFilter) {
                filters.value = regexFilter;
            }
        }
        return collection.countDocuments(filters);
    };

    return collection;
};
