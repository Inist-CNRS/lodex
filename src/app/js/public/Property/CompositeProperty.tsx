// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import camelCase from 'lodash/camelCase';
import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import Property from './';
import getFieldClassName from '../../lib/getFieldClassName';

const styles = {
    container: {
        display: 'flex',
        flexFlow: 'row wrap',
    },
    property: {
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
    },
};

export const CompositePropertyComponent = ({
    // @ts-expect-error TS7031
    compositeFields,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    parents,
    // @ts-expect-error TS7031
    resource,
}) => {
    if (!compositeFields.length) {
        return null;
    }

    return (
        <div style={styles.container}>
            {/*
             // @ts-expect-error TS7006 */}
            {compositeFields.map((f) => (
                <Property
                    // @ts-expect-error TS2322
                    className={`compose_${getFieldClassName(field)} ${camelCase(f.internalName || '')}`}
                    key={f.name}
                    field={f}
                    isSub
                    parents={parents}
                    resource={resource}
                    style={styles.property}
                />
            ))}
        </div>
    );
};

CompositePropertyComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    parents: PropTypes.arrayOf(PropTypes.string).isRequired,
    resource: PropTypes.shape({}).isRequired,
};

CompositePropertyComponent.defaultProps = {
    className: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { field, resource, parents }) => {
    const allCompositeFields = fromFields.getCompositeFieldsByField(
        state,
        field,
    );

    const compositeFields = allCompositeFields?.filter(
        // @ts-expect-error TS7006
        (f) => f?.name && !parents.includes(f.name),
    );

    return {
        resource,
        compositeFields,
    };
};

// @ts-expect-error TS2345
const CompositeProperty = connect(mapStateToProps)(CompositePropertyComponent);

export default CompositeProperty;
