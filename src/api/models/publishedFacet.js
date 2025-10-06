import chunk from 'lodash/chunk';
import { getCreatedCollection } from './utils';

export default async (db) => {
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

    const escapeRegex = (char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const toAccentInsensitive = (text) =>
        text
            .split('')
            .map((c) => accentMap[c] || escapeRegex(c))
            .join('');

    /**
     * Crée une regex accent-insensible et tolérante aux séparateurs
     *
     * @param {string} filter - Le terme de recherche
     * @returns {Object|null} - Un filtre regex MongoDB
     */
    const createWordStartRegex = (filter) => {
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
                (word) => `(^|[^a-z0-9])${toAccentInsensitive(word)}`,
            );
            // Tous les mots doivent être présents (ordre flexible avec lookahead)
            const patterns = wordPatterns
                .map((pattern) => `(?=.*${pattern})`)
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
    collection.insertBatch = async (documents) => {
        for (const data of chunk(documents, 100)) {
            await collection.insertMany(data);
        }
    };

    collection.insertFacet = (field, values) =>
        collection.insertBatch(values.map((value) => ({ field, ...value })));

    /**
     * Récupère une page de résultats avec skip/limit/sort
     */
    collection.findLimitFromSkip = ({
        limit,
        skip,
        filters,
        sortBy = 'count',
        sortDir = 'DESC',
    }) =>
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
    }) => {
        const filters = { field };
        if (filter?.trim()) {
            const regexFilter = createWordStartRegex(filter.trim());
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

    collection.countValuesForField = (field, filter) => {
        const filters = { field };
        if (filter?.trim()) {
            const regexFilter = createWordStartRegex(filter.trim());
            if (regexFilter) filters.value = regexFilter;
        }
        return collection.count(filters);
    };

    return collection;
};
