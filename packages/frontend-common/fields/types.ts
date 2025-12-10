export type Field<T extends object = { [key: string]: unknown }> = {
    _id: string;
    name: string;
    language?: string;
    completes?: boolean;
    width?: number;
    label?: string;
    scheme?: string;
    subresourceId?: string;
    overview?: number;
    position?: number;
    isDefaultSortField?: boolean;
    sortOrder?: 'asc' | 'desc';
    scope?: string;
    format?: {
        name: string;
        args?: T;
    };
    composedOf?: {
        fields: string[];
    };
};

export interface TransformerDraft {
    operation: string;
    args?: {
        name: string;
        type: string;
        value: string;
    }[];
}
export interface Transformer extends TransformerDraft {
    id: string;
}

export interface PreviewLine {
    [fieldName: string]: string;
}
