import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useInView } from 'react-intersection-observer';

import Property from '../public/Property';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';
import stylesToClassname from '../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        loading: {
            height: '500px !important',
            width: '100% !important',
        },
        loaded: {
            height: '0px !important',
            width: '0px !important',
        },
    },
    'dataset-characteristic-item',
);

export const DatasetCharacteristicItemComponent = ({
    resource,
    field,
    style,
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: '50px 0px',
    });

    return (
        <Fragment>
            <div
                ref={ref}
                className={inView ? styles.loaded : styles.loading}
            />
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
