import { Overview } from '../overview';

const overviewValues = [
    Overview.RESOURCE_TITLE,
    Overview.RESOURCE_DESCRIPTION,
    Overview.RESOURCE_DETAIL_1,
    Overview.RESOURCE_DETAIL_2,
    Overview.RESOURCE_DETAIL_3,
    Overview.SUBRESOURCE_TITLE,
];

export const isFieldRequired = (field: any) =>
    !!(field && overviewValues.includes(field.overview));

export default isFieldRequired;
