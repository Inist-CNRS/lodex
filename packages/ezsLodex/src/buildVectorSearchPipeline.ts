type BuildVectorSearchPipelineParams = {
    queryVector: number[];
    filter: object;
    filterDocuments: object;
    limit: number;
    minScore: number;
};

// numCandidates is capped at 10000 by $vectorSearch and must be >= limit
const MAX_VECTOR_SEARCH_LIMIT = 10000;

export const buildVectorSearchPipeline = ({
    queryVector,
    filter,
    filterDocuments,
    limit,
    minScore,
}: BuildVectorSearchPipelineParams): object[] => {
    const hasDocumentFilter = Object.keys(filterDocuments).length > 0;
    const clampedLimit = Math.min(MAX_VECTOR_SEARCH_LIMIT, limit);

    return [
        {
            $vectorSearch: {
                index: 'vector_index',
                path: 'value',
                filter,
                queryVector,
                numCandidates: Math.min(
                    MAX_VECTOR_SEARCH_LIMIT,
                    Math.max(150, clampedLimit * 10),
                ),
                limit: clampedLimit,
            },
        },
        {
            $project: {
                _id: 0,
                id: 1,
                value: { $meta: 'vectorSearchScore' },
            },
        },
        // No threshold applies without a document filter: this keeps the
        // behaviour vsearch/vanswer had before minSimilarity was added.
        ...(hasDocumentFilter
            ? [{ $match: { value: { $gte: minScore } } }]
            : []),
        {
            $lookup: {
                from: 'publishedDataset',
                localField: 'id',
                foreignField: 'uri',
                as: 'documents',
            },
        },
        {
            $match: hasDocumentFilter
                ? { documents: { $elemMatch: filterDocuments } }
                : {},
        },
        { $sort: { value: -1 } },
    ];
};
