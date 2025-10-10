export interface Field {
    name: string;
    label: string;
    scheme: string;
    subresourceId?: string;
}

export interface Subresource {
    _id: string;
    identifier: string;
    name: string;
    path: string;
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
