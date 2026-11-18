import { ObjectId, type Collection, type Db } from 'mongodb';
import { getCreatedCollection } from './utils';

// The catalog model the site wizard restored: it tells what a data addition
// can be guided by. At most one document.
export type SiteModel = { _id: ObjectId; modelId: string };

export type SiteModelCollection = Collection<SiteModel> & {
    findCurrent: () => Promise<SiteModel | null>;
    remember: (modelId: string) => Promise<void>;
    forget: () => Promise<void>;
};

export default async (db: Db): Promise<SiteModelCollection> => {
    const collection: Collection<SiteModel> = await getCreatedCollection(
        db,
        'siteModel',
    );

    const repository = collection as SiteModelCollection;

    repository.findCurrent = async () => collection.findOne({});

    // A single atomic operation: the existing document keeps its _id
    repository.remember = async (modelId) => {
        await collection.findOneAndReplace({}, { modelId }, { upsert: true });
    };

    repository.forget = async () => {
        await collection.deleteMany({});
    };

    return repository;
};
