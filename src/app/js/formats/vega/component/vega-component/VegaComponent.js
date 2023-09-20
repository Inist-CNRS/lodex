import { Vega } from 'react-vega';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAdmin } from '../../../../user';
import deepClone from 'lodash.clonedeep';
import {
    VEGA_DATA_INJECT_TYPE_A,
    VEGA_DATA_INJECT_TYPE_B,
} from '../../../chartsUtils';
import set from 'lodash.set';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
const CustomActionVega = ({ user, data, spec, injectType }) => {
    const actions = useMemo(() => {
        const defaultActions = {
            export: {
                svg: true,
                png: true,
            },
            source: false,
            compiled: false,
            editor: false,
        };
        if (isAdmin(user)) {
            return {
                ...defaultActions,
                source: true,
                compiled: true,
                editor: true,
            };
        }
        return defaultActions;
    }, [user]);

    const specWithData = useMemo(() => {
        const tmpSpec = deepClone(spec);

        if (injectType === VEGA_DATA_INJECT_TYPE_A) {
            tmpSpec.data.forEach(entry => {
                if (entry.name === 'table') {
                    set(entry, 'values', data.values);
                }
            });
            return tmpSpec;
        }

        if (injectType === VEGA_DATA_INJECT_TYPE_B) {
            const mappedData = data.values.map(entry => ({
                origin: entry.source,
                destination: entry.target,
                count: entry.weight,
            }));
            tmpSpec.data.forEach(entry => {
                if (entry.name === 'routes' || entry.name === 'link_data') {
                    set(entry, 'values', mappedData);
                }
            });
            return tmpSpec;
        }

        return tmpSpec;
    }, [injectType, spec, data]);

    return <Vega spec={specWithData} actions={actions} mode="vega" />;
};

/**
 * Element required in the props
 * @type {{data: Requireable<any>, user: Requireable<any>, spec: Validator<NonNullable<any>>}}
 */
CustomActionVega.propTypes = {
    user: PropTypes.any,
    spec: PropTypes.any.isRequired,
    data: PropTypes.any,
    injectType: PropTypes.number.isRequired,
};

/**
 * Function use to get the user state
 * @param state application state
 * @returns {{user: *}} user state
 */
const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(CustomActionVega);
