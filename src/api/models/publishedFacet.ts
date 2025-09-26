// @ts-expect-error TS(2792): Cannot find module 'lodash/chunk'. Did you mean to... Remove this comment to see the full error message
import chunk from 'lodash/chunk';
import { getCreatedCollection } from './utils';

export default async (db: any) => {
    const collection = await getCreatedCollection(db, 'publishedFacet');

    /**
     * Table de correspondance lettres → regex accent-insensible
     */
    const accentMap = {
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

    const toAccentInsensitive = (text: string) =>
        text
            .split('')
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            .map((c) => accentMap[c] || escapeRegex(c))
            .join('');

    /**
     * Crée une regex accent-insensible et tolérante aux séparateurs
     *
     * @param {string} filter - Le terme de recherche
     * @returns {Object|null} - Un filtre regex MongoDB
     */
    const createWordStartRegex = (filter: any) => {
        if (!filter) return null;

        const normalized = filter
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .trim();

        if (!normalized) return null;

        if (normalized.includes(' ')) {
            // multi-mots (ex: "CAN University of Toronto" → "CAN / University of Toronto")
            // Chaque mot doit être présent comme début d'un mot
            const words = normalized.split(/\s+/).filter(Boolean);
            const wordPatterns = words.map(
                (word: string) => `(^|[^a-z0-9])${toAccentInsensitive(word)}`,
            );
            // Tous les mots doivent être présents (ordre flexible avec lookahead)
            const patterns = wordPatterns
                .map((pattern: string) => `(?=.*${pattern})`)
                .join('');
            return {
                $regex: `^${patterns}.*`,
                $options: 'i',
            };
        }

        // mot simple
        return {
            $regex: `(^|[^a-z0-9])${toAccentInsensitive(normalized)}`,
            $options: 'i',
        };
    };

    /**
     * Insertions par lot
     */
    collection.insertBatch = async (documents: any) => {
        for (const data of chunk(documents, 100)) {
            await collection.insertMany(data);
        }
    };

    collection.insertFacet = (field: any, values: any) =>
        collection.insertBatch(
            values.map((value: any) => ({ field, ...value })),
        );

    /**
     * Récupère une page de résultats avec skip/limit/sort
     */
    collection.findLimitFromSkip = ({
        limit,
        skip,
        filters,
        sortBy = 'count',
        sortDir = 'DESC',
    }: any) =>
        collection
            .find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortDir === 'ASC' ? 1 : -1, _id: 1 })
            .toArray();

    collection.findValuesForField = ({
        field,
        filter,
        page = 0,
        perPage = 10,
        sortBy,
        sortDir,
    }: any) => {
        const filters = { field };
        if (filter?.trim()) {
            const regexFilter = createWordStartRegex(filter.trim());
            // @ts-expect-error TS2339
            if (regexFilter) filters.value = regexFilter;
        }

        return collection.findLimitFromSkip({
            limit: parseInt(perPage, 10),
            skip: page * perPage,
            filters,
            sortBy,
            sortDir,
        });
    };

    collection.countValuesForField = (field: any, filter: any) => {
        const filters = { field };
        if (filter?.trim()) {
            const regexFilter = createWordStartRegex(filter.trim());
            // @ts-expect-error TS2339
            if (regexFilter) filters.value = regexFilter;
        }
        return collection.count(filters);
    };

    return collection;
};
