import omit from 'lodash/omit.js';

// import { VALIDATED } from '../../common/propositionStatus'; // IN LODEX
const VALIDATED = 'VALIDATED';

export default function filterContributions(data: any, feed: any) {
    if (data && data.contributions) {
        const fieldsToIgnore = data.contributions
            .filter(({
            status
        }: any) => status !== VALIDATED)
            .map(({
            fieldName
        }: any) => fieldName)
            .concat('contributions', 'contributionCount');
        feed.send(omit(data, fieldsToIgnore));
        return;
    }

    feed.send(data);
}
