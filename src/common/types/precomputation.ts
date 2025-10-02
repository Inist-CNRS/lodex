export type PreComputation = {
    _id: string;
    name: string;
    webServiceUrl: string;
    sourceColumns: string[];
    subPath: string;
};

export type NewPreComputation = Omit<PreComputation, '_id'>;
