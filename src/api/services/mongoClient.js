import { MongoClient } from 'mongodb';
import config from 'config';

export default () => MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
