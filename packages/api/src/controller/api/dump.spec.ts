import dump from './dump';
import createDatasetModel from '../../models/dataset';
import { MongoClient } from 'mongodb';
import { Writable } from 'stream';

describe('API: Dump', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let datasetModel: any;
    let connection: any;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
        datasetModel = await createDatasetModel(db);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await datasetModel.deleteMany({});
        await datasetModel.insertMany([
            {
                name: 'John Doe',
                age: 30,
                job: 'Software Engineer',
            },
            {
                name: 'Jane Doe',
                age: 25,
                job: 'Data Scientist',
            },
        ]);
    });

    it('should allow to download a dump of the dataset', async () => {
        const writableStream = new Writable();
        const set = jest.fn();
        let data = '';

        writableStream._write = (chunk: any, _encoding: any, callback: any) => {
            data += chunk.toString();
            callback();
        };
        writableStream._final = (callback: any) => {
            callback();
        };

        await dump({
            query: {
                fields: 'name,age,job',
            },
            dataset: datasetModel,
            set,
            status: 200,
            res: writableStream,
            tenant: 'instance-name',
        });

        expect(data).toBe(
            '{"name":"John Doe","age":30,"job":"Software Engineer"}\n{"name":"Jane Doe","age":25,"job":"Data Scientist"}\n',
        );

        expect(set.mock.calls[0][0]).toBe('Content-disposition');
        expect(
            set.mock.calls[0][1].startsWith(
                'attachment; filename=instance-name_dataset_',
            ) && set.mock.calls[0][1].endsWith('.jsonl'),
        ).toBeTruthy();
    });

    it('should allow to download a dump of the dataset with specific fields', async () => {
        const writableStream = new Writable();
        let data = '';

        writableStream._write = (chunk: any, _encoding: any, callback: any) => {
            data += chunk.toString();
            callback();
        };
        writableStream._final = (callback: any) => {
            callback();
        };

        await dump({
            query: {
                fields: 'name',
            },
            dataset: datasetModel,
            set: jest.fn(),
            status: 200,
            res: writableStream,
            tenant: 'instance-name',
        });

        expect(data).toBe('{"name":"John Doe"}\n{"name":"Jane Doe"}\n');
    });
});
