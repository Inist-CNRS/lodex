import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
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
    resource,
    field,
    style,
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: `${LOADING_BOX_HEIGHT * 2}px 0px`,
    });

    return (
        <Fragment>
            <div ref={ref} style={inView ? styles.loaded : styles.loading} />
            {inView && (
                <Property resource={resource} field={field} style={style} />
            )}
        </Fragment>
    );
};

DatasetCharacteristicItemComponent.propTypes = {
    resource: PropTypes.shape({
        uri: PropTypes.string.isRequired,
    }).isRequired,
    field: fieldPropTypes.isRequired,
    style: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, { characteristic: { name } }) => ({
    field: fromFields.getFieldByName(state, name),
    resource: {
        name,
        ...fromCharacteristic.getCharacteristicsAsResource(state),
    },
});

export default connect(mapStateToProps)(DatasetCharacteristicItemComponent);
