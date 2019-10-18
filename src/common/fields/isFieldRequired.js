import {
    RESOURCE_TITLE,
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
} from '../overview';

const overviewValues = [
    RESOURCE_TITLE,
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
];

export default field => field && overviewValues.includes(field.overview);
