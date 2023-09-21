import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAdmin } from '../../../../user';
import {
    VEGA_LITE_DATA_INJECT_TYPE_A,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../../chartsUtils';
import deepClone from 'lodash.clonedeep';

export const VEGA_ACTIONS_WIDTH = 40;

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVegaLite(props) {
    let actions;
    if (isAdmin(props.user)) {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: true,
            compiled: true,
            editor: true,
        };
    } else {
        actions = {
            export: {
                svg: true,
                png: true,
            },
            source: false,
            compiled: false,
            editor: false,
        };
    }

    const spec = props.spec;

    switch (props.injectType) {
        case VEGA_LITE_DATA_INJECT_TYPE_A:
            spec.data = props.data;
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_B:
            spec.transform.forEach(e => {
                if (e.lookup === 'id') {
                    e.from.data.values = props.data.values;
                }
            });
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_C:
            spec.transform.forEach(e => {
                if (e.lookup === 'properties.HASC_2') {
                    e.from.data.values = props.data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    return <Vega spec={deepClone(spec)} actions={actions} mode="vega-lite" />;
}

/**
 * Element required in the props
 * @type {{data: Requireable<any>, user: Requireable<any>, spec: Validator<NonNullable<any>>}}
 */
CustomActionVegaLite.propTypes = {
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

export default connect(mapStateToProps)(CustomActionVegaLite);
