import type { TaskStatusType } from '../taskStatusType';

export type Precomputed = {
    _id: string;
    name: string;
    hasData: boolean;
    status?: TaskStatusType;
};
