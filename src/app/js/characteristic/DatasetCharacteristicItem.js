import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import moment from 'moment';

import Property from '../public/Property';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';

export const DatasetCharacteristicItemComponent = ({
    resource,
    field,
    style,
}) => {
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        if (!logged) {
            console.log(`There are ${Object.keys(resource).length}  fields`);
            setLogged(true);
        }
    }, [resource]);

    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: '0px',
    });

    useEffect(() => {
        if (inView) {
            console.log(
                `${field.name} displayed at ${moment(new Date()).format(
                    'hh:mm:ss',
                )}`,
            );
        }
    }, [inView]);

    return (
        <span
            ref={ref}
            style={
                !inView
                    ? {
                          display: 'block',
                          minHeight: '300px',
                          width: '100%',
                      }
                    : {
                          height: '100%',
                          width: '100%',
                      }
            }
        >
            {inView && (
                <Property resource={resource} field={field} style={style} />
            )}
        </span>
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
