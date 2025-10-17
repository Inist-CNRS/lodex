export interface Field {
    _id: string;
    name: string;
    label?: string;
    scheme?: string;
    subresourceId?: string;
    overview?: number;
    position?: number;
    isDefaultSortField?: boolean;
    sortOrder?: 'asc' | 'desc';
}

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
