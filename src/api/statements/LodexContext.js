import { MongoClient } from 'mongodb';
import config from 'config';
import set from 'lodash.set';
import field from '../models/field';
import publishedCharacteristic from '../models/publishedCharacteristic';

export const LodexContext = MongoClientImpl =>
    async function LodexContextImpl(data, feed) {
        if (this.isLast()) {
            feed.close();
            return;
        }
        const target = this.getParam('target');
        const handleDb = await MongoClientImpl.connect(
            `mongodb://${config.mongo.host}/${config.mongo.dbName}`,
        );
        const handleField = await field(handleDb);
        const handlePublishedCharacteristic = await publishedCharacteristic(
            handleDb,
        );
        const characteristics = await handlePublishedCharacteristic.findAllVersions();
        const fields = await handleField.findAll();
        const host = config.host;
        const cleanHost = config.cleanHost;
        set(data, `${target || '$context'}`, {
            fields,
            characteristics,
            host,
            cleanHost,
        });
        feed.send(data);
        await handleDb.close();
    };

export default LodexContext(MongoClient);
