import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAdmin } from '../../../../user';
import deepClone from 'lodash/cloneDeep';
import {
    VEGA_DATA_INJECT_TYPE_A,
    VEGA_DATA_INJECT_TYPE_B,
} from '../../chartsUtils';
import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import ZoomableFormat from '../ZoomableFormat';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVega(props) {
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
        case VEGA_DATA_INJECT_TYPE_A:
            spec.data.forEach((e) => {
                if (e.name === 'table') {
                    e.values = props.data.values;
                }
            });
            break;
        case VEGA_DATA_INJECT_TYPE_B:
            {
                let data = {
                    values: [],
                };
                props.data.values.forEach((e) => {
                    data.values.push({
                        origin: e.source,
                        destination: e.target,
                        count: e.weight,
                    });
                });
                spec.data.forEach((e) => {
                    if (e.name === 'routes' || e.name === 'link_data') {
                        e.values = data.values;
                    }
                });
            }
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    return (
        <ZoomableFormat>
            <style>{'#vg-tooltip-element {z-index:99999}'}</style>
            <Vega
                style={
                    props.aspectRatio === ASPECT_RATIO_NONE
                        ? { width: '100%' }
                        : { width: '100%', aspectRatio: props.aspectRatio }
                }
                spec={deepClone(props.spec)}
                actions={actions}
                mode="vega"
            />
        </ZoomableFormat>
    );
}

CustomActionVega.defaultProps = {
    aspectRatio: ASPECT_RATIO_NONE,
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
    aspectRatio: PropTypes.oneOf(ASPECT_RATIOS),
};

/**
 * Function use to get the user state
 * @param state application state
 * @returns {{user: *}} user state
 */
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(CustomActionVega);
