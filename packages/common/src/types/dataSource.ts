import type { TaskStatusType } from '../taskStatusType';

export type DataSourceColumn = {
    name: string;
    subPaths: string[];
};

export type DataSource = {
    id: string;
    name: string;
    columns: DataSourceColumn[];
    status?: TaskStatusType | '' | undefined;
    isEmpty: boolean;
};
