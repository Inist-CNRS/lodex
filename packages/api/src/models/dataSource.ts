import {
    TaskStatus,
    type DataSource,
    type DataSourceColumn,
} from '@lodex/common';
import type { PrecomputedCollection } from './precomputed';

export const DATASET_ID = 'dataset';

export default function createDataSourceService(
    datasetService: DatasetService,
    precomputedService: PrecomputedService,
) {
    return {
        async getDataSources(): Promise<DataSource[]> {
            const [precomputed, datasetColumns] = await Promise.all([
                precomputedService.findAll(),
                datasetService.getColumnsWithSubPaths(),
            ]);

            const precomputedWithColumns = await Promise.all(
                precomputed.map(
                    async ({
                        _id,
                        name,
                        status,
                        hasData,
                    }): Promise<DataSource> => {
                        if (hasData === false) {
                            return {
                                id: _id.toString(),
                                name,
                                status,
                                columns: [],
                                isEmpty: true,
                            };
                        }

                        const columns =
                            await precomputedService.getColumnsWithSubPaths(
                                _id,
                            );

                        return {
                            id: _id.toString(),
                            name,
                            status,
                            columns,
                            isEmpty: columns.length === 0,
                        };
                    },
                ),
            );

            return [
                {
                    id: DATASET_ID,
                    name: DATASET_ID,
                    columns: datasetColumns,
                    status:
                        datasetColumns.length > 0
                            ? TaskStatus.FINISHED
                            : undefined,
                    isEmpty: datasetColumns.length === 0,
                },
                ...precomputedWithColumns,
            ];
        },

        async removeAttribute(
            dataSource: string | null | undefined,
            attribute: string,
        ): Promise<void> {
            if (!dataSource || dataSource === DATASET_ID) {
                await datasetService.removeAttribute(attribute);
            } else {
                await precomputedService.removeResultColumn(
                    dataSource,
                    attribute,
                );
            }
        },
    };
}

export type DatasetService = {
    getColumnsWithSubPaths(): Promise<DataSourceColumn[]>;
    removeAttribute(attribute: string): Promise<void>;
};
export type PrecomputedService = Pick<
    PrecomputedCollection,
    'findAll' | 'getColumnsWithSubPaths' | 'removeResultColumn'
>;

export type DataSourceService = ReturnType<typeof createDataSourceService>;
