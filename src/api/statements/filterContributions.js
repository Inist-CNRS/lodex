import omit from 'lodash.omit';
import { VALIDATED } from '../../common/propositionStatus';

module.exports = function filterContributions(data, feed) {
    if (data && data.contributions) {
        const fieldsToIgnore = data.contributions
            .filter(({ status }) => status !== VALIDATED)
            .map(({ fieldName }) => fieldName)
            .concat('contributions', 'contributionCount');
        feed.send(omit(data, fieldsToIgnore));
        return;
    }

    feed.send(data);
};
