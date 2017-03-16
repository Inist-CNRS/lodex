import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { grey500 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';

import { fromResource } from './selectors';
import { field as fieldPropTypes } from '../propTypes';
import CompositeProperty from './CompositeProperty';
import { languages } from '../../../../config.json';
import propositionStatus, { REJECTED } from '../../../common/propositionStatus';
import ModerateButton from './ModerateButton';
import { changeFieldStatus } from './resource';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';
import { isLoggedIn } from '../user';

const styles = {
    container: memoize(style => Object.assign({
        display: 'flex',
        flexDirection: 'column',
        marginRight: '1rem',
    }, style)),
    label: memoize(status => Object.assign({
        color: grey500,
        fontWeight: 'bold',
        marginRight: '1rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    })),
    language: {
        marginLeft: '0.5rem',
        fontSize: '0.75em',
        color: 'grey',
    },
    scheme: {
        fontWeight: 'bold',
        fontSize: '0.75em',
        color: 'grey',
        textAlign: 'right',
    },
};

const PropertyComponent = ({
    className,
    field,
    resource,
    fieldStatus,
    loggedIn,
    changeStatus,
    style,
}) => {
    if (!loggedIn && fieldStatus === REJECTED) {
        return null;
    }

    return (
        <div
            className={classnames('property', field.label.toLowerCase().replace(/\s/g, '_'), className)}
            style={styles.container(style, fieldStatus)}
        >
            <div>
                <span className="property_label" style={styles.label(fieldStatus)}>{field.label}</span>
                {field.language &&
                    <span className="property_language" style={styles.language}>
                        ({languages.find(f => f.code === field.language).label})
                    </span>
                }
                <PropertyContributor fieldName={field.name} fieldStatus={fieldStatus} />
            </div>
            <CompositeProperty field={field} resource={resource} />
            <div className="property_scheme" style={styles.scheme}>{field.scheme}</div>
            <PropertyLinkedFields fieldName={field.name} resource={resource} />
            <ModerateButton status={fieldStatus} changeStatus={changeStatus} />
        </div>
    );
};

PropertyComponent.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.shape({}).isRequired,
    fieldStatus: PropTypes.oneOf(propositionStatus),
    changeStatus: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
};

const mapStateToProps = (state, { field }) => ({
    loggedIn: isLoggedIn(state),
    fieldStatus: fromResource.getFieldStatus(state, field),
});

const mapDispatchToProps = (dispatch, { field, resource: { uri } }) => bindActionCreators({
    changeStatus: (prevStatus, status) => changeFieldStatus({
        uri,
        field: field.name,
        status,
        prevStatus,
    }),
}, dispatch);

const Property = connect(mapStateToProps, mapDispatchToProps)(PropertyComponent);

export default Property;
