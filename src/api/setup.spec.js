import mongoClient from './services/mongoClient';

after(async () => {
    const db = await mongoClient();
    db.close();
});
