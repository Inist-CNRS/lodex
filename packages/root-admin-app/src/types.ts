export type Tenant = {
    _id: string;
    name?: string;
    description: string;
    author: string;
    username: string;
    password: string;
    createdAt?: string;
    dataset?: number;
    published?: boolean;
    totalSize?: number;
};
