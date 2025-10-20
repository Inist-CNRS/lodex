import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { useTranslate } from '../../i18n/I18NContext';

import { fromResource } from '../selectors';
import {
    PROPOSED,
    VALIDATED,
    REJECTED,
    type PropositionStatus,
} from '../../../../common/propositionStatus';

const styles = {
    container: (status: PropositionStatus) => ({
        display: 'flex',
        marginRight: '1rem',
        color: status && status !== VALIDATED ? 'grey' : 'black',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    }),
    name: {
        fontWeight: 'bold',
    },
    language: {
        marginLeft: '0.5rem',
        fontSize: '0.75em',
        color: 'grey',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
    },
};

interface PropertyContributorComponentProps {
    contributor?: string;
    fieldStatus?: PropositionStatus;
}

const PropertyContributorComponent = ({
    contributor,
    fieldStatus,
}: PropertyContributorComponentProps) => {
    const { translate } = useTranslate();
    if (!contributor) {
        return null;
    }

    return (
        <div className="property_contributor" style={styles.scheme}>
            {fieldStatus === PROPOSED
                ? translate('contributed_by', { name: contributor })
                : translate('added_by', { name: contributor })}
        </div>
    );
};

PropertyContributorComponent.defaultProps = {
    fieldStatus: null,
    contributor: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { fieldName }) => ({
    contributor: fromResource.getResourceContributorForField(state, fieldName),
});

export default compose(
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(PropertyContributorComponent);
