import dump from './dump';
import createDatasetModel from '../../models/dataset';
import { MongoClient } from 'mongodb';
import { Writable } from 'stream';

describe('API: Dump', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS;
    let datasetModel: any;
    let connection: any;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI!);
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
        let data = '';
        // @ts-expect-error TS(6133): 'encoding' is declared but its value is never read... Remove this comment to see the full error message
        writableStream._write = (chunk: any, encoding: any, callback: any) => {
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
            set: jest.fn(),
            status: 200,
            res: writableStream,
        });

        expect(data).toBe(
            '{"name":"John Doe","age":30,"job":"Software Engineer"}\n{"name":"Jane Doe","age":25,"job":"Data Scientist"}\n',
        );
    });
    it('should allow to download a dump of the dataset with specific fields', async () => {
        const writableStream = new Writable();
        let data = '';
        // @ts-expect-error TS(6133): 'encoding' is declared but its value is never read... Remove this comment to see the full error message
        writableStream._write = (chunk: any, encoding: any, callback: any) => {
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
        });

        expect(data).toBe('{"name":"John Doe"}\n{"name":"Jane Doe"}\n');
    });
});
