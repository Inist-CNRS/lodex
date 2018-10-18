import set from 'lodash.set';

import field from '../models/field';
import { getHost, getCleanHost } from '../../common/uris';
import publishedCharacteristic from '../models/publishedCharacteristic';
import mongoClient from '../services/mongoClient';

export const LodexContext = mongoClientImpl =>
    async function LodexContextImpl(data, feed) {
        if (this.isLast()) {
            feed.close();
            return;
        }
        const target = this.getParam('target');
        const handleDb = await mongoClientImpl();
        const handleField = await field(handleDb);
        const handlePublishedCharacteristic = await publishedCharacteristic(
            handleDb,
        );
        const characteristics = await handlePublishedCharacteristic.findAllVersions();
        const fields = await handleField.findAll();
        set(data, `${target || '$context'}`, {
            fields,
            characteristics,
            host: getCleanHost(),
            rawHost: getHost(),
            cleanHost: getCleanHost(),
        });
        feed.send(data);
    };

export default LodexContext(mongoClient);
