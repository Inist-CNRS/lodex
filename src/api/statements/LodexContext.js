import { MongoClient } from 'mongodb';
import config from 'config';
import field from '../models/field';
import publishedCharacteristic from '../models/publishedCharacteristic';

export const LodexContext = MongoClientImpl => async function (data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const target = this.getParam('target', '$context');
    const handleDb = await MongoClientImpl.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    const handleField = await field(handleDb);
    const handlePublishedCharacteristic = await publishedCharacteristic(handleDb);
    const characteristics = await handlePublishedCharacteristic.findAllVersions();
    const fields = await handleField.findAll();
    data[target] = {
        fields,
        characteristics,
    };
    feed.send(data);
    await handleDb.close();
};

export default LodexContext(MongoClient);
