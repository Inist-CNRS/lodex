import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';
import Property from './';
import getFieldClassName from '../../lib/getFieldClassName';

const styles = {
    container: {
        paddingLeft: '2rem',
        marginLeft: '2rem',
        borderLeft: '1px dotted rgb(224, 224, 224)',
        display: 'flex',
        flexFlow: 'row wrap',
    },
    property: {
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
    },
};

export const CompositePropertyComponent = ({
    compositeFields,
    field,
    parents,
    resource,
}) => {
    if (!compositeFields.length) {
        return null;
    }

    return (
        <div style={styles.container}>
            {compositeFields.map(f => (
                <Property
                    className={`compose_${getFieldClassName(field)}`}
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

const mapStateToProps = (state, { field, resource, parents }) => {
    const allCompositeFields = fromFields.getCompositeFieldsByField(
        state,
        field,
    );
    const compositeFields = allCompositeFields.filter(
        f => !parents.includes(f.name),
    );

    return {
        resource,
        compositeFields,
    };
};

const CompositeProperty = connect(mapStateToProps)(CompositePropertyComponent);

export default CompositeProperty;
