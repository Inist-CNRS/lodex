export type Field = {
    _id: string;
    name: string;
    label?: string;
    scheme?: string;
    subresourceId?: string;
    overview?: number;
    position?: number;
    isDefaultSortField?: boolean;
    sortOrder?: 'asc' | 'desc';
    format?: {
        name: string;
        args?: {
            [key: string]: unknown;
        };
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
