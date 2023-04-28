import { MongoClient } from 'mongodb';

export const handles = {};
async function mongoDatabase(connectionStringURI) {
    if (!handles[connectionStringURI]) {
        handles[connectionStringURI] = new MongoClient(
            connectionStringURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
    }
    const client = await handles[connectionStringURI].connect();
    return client.db();
}

export default mongoDatabase;
