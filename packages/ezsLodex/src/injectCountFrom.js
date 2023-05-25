import get from 'lodash.get';
import set from 'lodash.set';
import QuickLRU from 'quick-lru';
import mongoDatabase from './mongoDatabase';

/**
 * Inject in each item the last characteristics (the dataset covering fields) of a LODEX.
 *
 * <caption>Input:</caption>
 *
 * ```json
 * [
 *           { "id": 0, "value":2000  },
 *           { "id": 1, "value":2001  },
 *           { "id": 2, "value":2003  },
 *           { "id": 3, "value":2005  },
 *           { "id": 4, "value":2007  },
 *           { "id": 2, "value":2003  },
 *           { "id": 6, "value":2011  },
 *           { "id": 7, "value":2013  }
 * ]
 * ```
 *
 * <caption>Script:</caption>
 *
 * ```ini
 * [injectCountFrom]
 * path = value
 * field = publicationDate
 * ```
 *
 * <caption>Output:</caption>
 *
 * ```json
 * [
 *           { "id": 0, "value":2003, "value_count":3  },
 *           { "id": 1, "value":2001, "value_count":1  },
 *           { "id": 2, "value":2003, "value_count":3  },
 *           { "id": 3, "value":2005, "value_count":1  },
 *           { "id": 4, "value":2007, "value_count":1  },
 *           { "id": 2, "value":2003, "value_count":3  },
 *           { "id": 6, "value":2011, "value_count":2  },
 *           { "id": 7, "value":2011, "value_count":2  }
 * ]
 * ```
 *
 * @export
 * @param {string} connectionStringURI MongoDB connection string
 * @param {string} path to get value to find
 * @param {string} [field=auto] name contains the value to find (generaly equals to path)
 * @name LodexInjectCountFrom
 */
export async function LodexinjectCountFrom(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }
    const connectionStringURI = this.getParam('connectionStringURI');
    if (this.isFirst()) {
        const path = this.getParam('path');
        this.sourcePath = Array.isArray(path) ? path.shift() : path;
        this.targetPath = `${this.sourcePath}_count`;
        const field = this.getParam('field', path);
        this.fieldName = Array.isArray(field) ? field.shift() : field;

        const db = await mongoDatabase(connectionStringURI);
        this.collection = db.collection('publishedDataset');
        this.lru = new QuickLRU({ maxSize: 100 });
    }
    const fieldValue = get(data, this.sourcePath);
    const query = { [`versions.${this.fieldName}`]: fieldValue };

    if (this.lru.has(fieldValue)) {
        set(data, this.targetPath, this.lru.get(fieldValue));
    } else {
        const fieldCount = await this.collection.find(query).count();
        this.lru.set(fieldValue, fieldCount);
        set(data, this.targetPath, fieldCount);
    }
    return feed.send(data);
}
export default {
    injectCountFrom: LodexinjectCountFrom,
};
