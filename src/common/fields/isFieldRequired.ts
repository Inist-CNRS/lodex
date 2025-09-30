import {
    RESOURCE_TITLE,
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
    RESOURCE_DETAIL_3,
    SUBRESOURCE_TITLE,
} from '../overview';

const overviewValues = [
    RESOURCE_TITLE,
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
    RESOURCE_DETAIL_3,
    SUBRESOURCE_TITLE,
];

export default (field: any) => !!(field && overviewValues.includes(field.overview));
