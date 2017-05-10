/* eslint no-console: off */
// Remove LODEX's mongoDB base
import { MongoClient } from 'mongodb';
import config from 'config';

// config.mongo.host = '127.0.0.1:27017';
// config.mongo.dbName = 'lodex-elise-1';
MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`, (err, db) => {
    if (err) {
        console.error('mongoCleanup:', err);
        return;
    }
    db.dropDatabase((err2) => {
        if (err2) {
            console.error('mongoCleanup 2:', err2);
        }
        db.close();
    });
});
