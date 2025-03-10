import dump from './dump';
import createDatasetModel from '../../models/dataset';
import { MongoClient } from 'mongodb';
import { ServerResponse } from 'http';
import { Writable } from 'stream';

describe('API: Dump', () => {
    const connectionStringURI = process.env.MONGO_URL;
    let datasetModel;
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
        writableStream._write = (chunk, encoding, callback) => {
            data += chunk.toString();
            callback();
        };
        writableStream._final = (callback) => {
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
        writableStream._write = (chunk, encoding, callback) => {
            data += chunk.toString();
            callback();
        };
        writableStream._final = (callback) => {
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
