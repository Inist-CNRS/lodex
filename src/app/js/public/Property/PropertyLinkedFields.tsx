import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import { changeFieldStatus } from '../resource';
import Property from './';

const styles = {
    container: {
        paddingLeft: '2rem',
        marginLeft: '2rem',
        borderLeft: '1px dotted rgb(224, 224, 224)',
    },
};

const PropertyLinkedFieldsComponent = ({
    // @ts-expect-error TS7031
    fieldName,
    // @ts-expect-error TS7031
    linkedFields,
    // @ts-expect-error TS7031
    parents,
    // @ts-expect-error TS7031
    resource,
}) => {
    if (!linkedFields.length) {
        return null;
    }
    return (
        <div className="linked_fields" style={styles.container}>
            {/*
             // @ts-expect-error TS7006 */}
            {linkedFields.map((linkedField) => (
                <Property
                    key={linkedField._id}
                    className={classnames(
                        'completes',
                        `completes_${fieldName}`,
                    )}
                    field={linkedField}
                    isSub
                    resource={resource}
                    parents={parents}
                />
            ))}
        </div>
    );
};

PropertyLinkedFieldsComponent.propTypes = {
    fieldName: PropTypes.string.isRequired,
    linkedFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    parents: PropTypes.arrayOf(PropTypes.string).isRequired,
    resource: PropTypes.shape({}).isRequired,
};

PropertyLinkedFieldsComponent.defaultProps = {
    fieldStatus: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { fieldName, parents = [] }) => {
    // @ts-expect-error TS2339
    const allLinkedFields = fromFields.getLinkedFields(state, fieldName);
    const linkedFields = allLinkedFields.filter(
        // @ts-expect-error TS7006
        (f) => !parents.includes(f.name),
    );

    return { linkedFields };
};

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch, { field, resource: { uri } }) =>
    bindActionCreators(
        {
            changeStatus: (prevStatus, status) =>
                changeFieldStatus({
                    uri,
                    field: field.name,
                    status,
                    prevStatus,
                }),
        },
        dispatch,
    );

const PropertyLinkedFields = connect(
    mapStateToProps,
    // @ts-expect-error TS2769
    mapDispatchToProps,
    // @ts-expect-error TS2345
)(PropertyLinkedFieldsComponent);

export default PropertyLinkedFields;
