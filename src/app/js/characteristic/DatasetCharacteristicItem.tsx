// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { connect } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import Property from '../public/Property';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';

const LOADING_BOX_HEIGHT = 250;

const styles = {
    loading: {
        height: `${LOADING_BOX_HEIGHT}px`,
        width: '100%',
    },
    loaded: {
        height: '0px',
        width: '0px',
    },
};

export const DatasetCharacteristicItemComponent = ({
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    style,
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: `${LOADING_BOX_HEIGHT * 2}px 0px`,
    });

    return (
        <>
            <div ref={ref} style={inView ? styles.loaded : styles.loading} />
            {inView && (
                <Property
                    // @ts-expect-error TS2322
                    resource={resource}
                    field={field}
                    style={style}
                    className={camelCase(field.internalName || '')}
                />
            )}
        </>
    );
};

DatasetCharacteristicItemComponent.propTypes = {
    resource: PropTypes.shape({
        uri: PropTypes.string,
    }).isRequired,
    field: fieldPropTypes.isRequired,
    style: PropTypes.shape({}).isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { characteristic: { name } }) => ({
    field: fromFields.getFieldByName(state, name),
    resource: {
        name,
        ...fromCharacteristic.getCharacteristicsAsResource(state),
    },
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
