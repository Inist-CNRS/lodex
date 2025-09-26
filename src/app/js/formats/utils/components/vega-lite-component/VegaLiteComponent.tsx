import { Vega } from 'react-vega';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import deepClone from 'lodash/cloneDeep';
import {
    VEGA_LITE_DATA_INJECT_TYPE_A,
    VEGA_LITE_DATA_INJECT_TYPE_B,
    VEGA_LITE_DATA_INJECT_TYPE_C,
} from '../../chartsUtils';
import { ASPECT_RATIO_NONE, ASPECT_RATIOS } from '../../aspectRatio';
import FormatFullScreenMode from '../FormatFullScreenMode';
import { translate } from '../../../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { compose } from 'recompose';
import { useVegaCsvExport } from '../useVegaCsvExport';
import { useVegaActions } from '../useVegaActions';

/**
 * small component use to handle vega lite display
 * @param props args taken by the component
 * @returns {*} React-Vega component
 */
function CustomActionVegaLite({
    aspectRatio,
    user,
    spec,
    data,
    injectType,
    disableZoom,
    p: polyglot,
}) {
    const actions = useVegaActions(user);
    const graphParentRef = useVegaCsvExport(polyglot, data);

    const specWithData = spec;
    const { height: specHeight } = specWithData;

    switch (injectType) {
        case VEGA_LITE_DATA_INJECT_TYPE_A:
            specWithData.data = data;
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_B:
            specWithData.transform.forEach((e) => {
                if (e.lookup === 'id') {
                    e.from.data.values = data.values;
                }
            });
            break;
        case VEGA_LITE_DATA_INJECT_TYPE_C:
            specWithData.transform.forEach((e) => {
                if (e.lookup === 'properties.HASC_2') {
                    e.from.data.values = data.values;
                }
            });
            break;
        default:
            throw new Error('Invalid data injection type');
    }

    const vegaGraphElement = (
        <Vega
            style={
                aspectRatio === ASPECT_RATIO_NONE
                    ? {
                          width: '100%',
                          aspectRatio:
                              // If no height is provided when the spec height is set to container,
                              // the graph height is very small. As a workaround we set a default aspect ratio of 2/1.
                              specHeight === 'container' ? '2 / 1' : undefined,
                      }
                    : { width: '100%', aspectRatio }
            }
            spec={deepClone(specWithData)}
            actions={actions}
            mode="vega-lite"
            i18n={{
                SVG_ACTION: polyglot.t('vega_export_svg'),
                PNG_ACTION: polyglot.t('vega_export_png'),
                CLICK_TO_VIEW_ACTIONS: polyglot.t('vega_click_to_view_actions'),
                COMPILED_ACTION: polyglot.t('vega_compiled_action'),
                EDITOR_ACTION: polyglot.t('vega_editor_action'),
                SOURCE_ACTION: polyglot.t('vega_source_action'),
            }}
        />
    );

    return (
        <>
            <style>{'#vg-tooltip-element {z-index:99999}'}</style>
            {disableZoom ? (
                <div ref={graphParentRef}>{vegaGraphElement}</div>
            ) : (
                <FormatFullScreenMode>
                    <div
                        ref={graphParentRef}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {vegaGraphElement}
                    </div>
                </FormatFullScreenMode>
            )}
        </>
    );
}

CustomActionVegaLite.defaultProps = {
    disableZoom: false,
    aspectRatio: ASPECT_RATIO_NONE,
};

/**
 * Element required in the props
 * @type {{data: Requireable<any>, user: Requireable<any>, spec: Validator<NonNullable<any>>}}
 */
CustomActionVegaLite.propTypes = {
    disableZoom: PropTypes.bool,
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
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(CustomActionVegaLite);
