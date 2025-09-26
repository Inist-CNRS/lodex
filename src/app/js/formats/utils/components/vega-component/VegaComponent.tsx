import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import deepClone from 'lodash/cloneDeep';
import {
    VEGA_DATA_INJECT_TYPE_A,
    VEGA_DATA_INJECT_TYPE_B,
    VEGA_DATA_INJECT_TYPE_C,
} from '../../chartsUtils';
import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import FormatFullScreenMode from '../FormatFullScreenMode';
import { useVegaActions } from '../useVegaActions';
import { useVegaCsvExport } from '../useVegaCsvExport';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
// @ts-expect-error TS7016
import { compose } from 'recompose';
import { translate } from '../../../../i18n/I18NContext';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
// @ts-expect-error TS7006
function CustomActionVega(props) {
    const actions = useVegaActions(props.user);
    const polyglot = props.p;
    const graphParentRef = useVegaCsvExport(props.p, props.data);

    const spec = props.spec;

    switch (props.injectType) {
        case VEGA_DATA_INJECT_TYPE_A:
            // @ts-expect-error TS7006
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
                // @ts-expect-error TS7006
                props.data.values.forEach((e) => {
                    // @ts-expect-error TS2345
                    data.values.push({
                        origin: e.source,
                        destination: e.target,
                        count: e.weight,
                    });
                });
                // @ts-expect-error TS7006
                spec.data.forEach((e) => {
                    if (e.name === 'routes' || e.name === 'link_data') {
                        e.values = data.values;
                    }
                });
            }
            break;
        case VEGA_DATA_INJECT_TYPE_C:
            // @ts-expect-error TS7006
            spec.data.forEach((e) => {
                if (e.name === 'tree') {
                    e.values = props.data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    return (
        <FormatFullScreenMode>
            <style>{'#vg-tooltip-element {z-index:99999}'}</style>
            {/*
             // @ts-expect-error TS2322 */}
            <div ref={graphParentRef} style={{ width: '100%', height: '100%' }}>
                <Vega
                    style={
                        props.aspectRatio === ASPECT_RATIO_NONE
                            ? { width: '100%' }
                            : { width: '100%', aspectRatio: props.aspectRatio }
                    }
                    spec={deepClone(props.spec)}
                    actions={actions}
                    mode="vega"
                    i18n={{
                        SVG_ACTION: polyglot.t('vega_export_svg'),
                        PNG_ACTION: polyglot.t('vega_export_png'),
                        CLICK_TO_VIEW_ACTIONS: polyglot.t(
                            'vega_click_to_view_actions',
                        ),
                        COMPILED_ACTION: polyglot.t('vega_compiled_action'),
                        EDITOR_ACTION: polyglot.t('vega_editor_action'),
                        SOURCE_ACTION: polyglot.t('vega_source_action'),
                    }}
                />
            </div>
        </FormatFullScreenMode>
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
    p: polyglotPropTypes.isRequired,
};

/**
 * Function use to get the user state
 * @param state application state
 * @returns {{user: *}} user state
 */
// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default compose(connect(mapStateToProps), translate)(CustomActionVega);
