export type ResourcesListArgs = {
    params?: {
        maxSize?: number;
        maxValue?: number;
        minValue?: number;
        orderBy?: string;
        maxResources?: number;
        minSimilarity?: number;
    };
    showMinSimilarity?: boolean;
    allowToLoadMore?: boolean;
    pageSize?: number;
    openInNewTab?: boolean;
};
