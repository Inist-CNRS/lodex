import generateUid from '../../services/generateUid';

export default async function transformCompleteFields(field) {
    const name = await generateUid();
    const complete = field.name;
    const completed = field.completes;
    return { name, complete, completed };
};
