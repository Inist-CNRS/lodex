import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import deepClone from 'lodash.clonedeep';
import ContainerDimensions from 'react-container-dimensions';
import { CustomActionVegaLite } from '../vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_B } from '../../../chartsUtils';
import { field as fieldPropTypes } from '../../../../propTypes';
import injectData from '../../../injectData';
import Cartography from '../../models/Cartography';
import { schemeOrRd } from 'd3-scale-chromatic';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class CartographyView extends Component {
    render() {
        const data = this.props.data;

        // Create a new cartography instance

        const cartography = deepClone(new Cartography());

        // Set all cartography parameter the chosen by the administrator

        cartography.setTooltip(this.props.tooltip);
        cartography.setTooltipCategory(this.props.tooltipCategory);
        cartography.setTooltipValue(this.props.tooltipValue);
        cartography.setColor(
            this.props.colorScheme !== undefined
                ? this.props.colorScheme.join(' ')
                : schemeOrRd[9],
        );
        cartography.setHoverColor(
            this.props.hoverColorScheme !== undefined
                ? this.props.hoverColorScheme[
                      Math.round(this.props.hoverColorScheme.length / 2)
                  ]
                : schemeOrRd[9],
        );

        // return the finish chart
        return (
            <div style={styles.container}>
                {/* Make the chart responsive */}
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = cartography.buildSpec(width);
                        return (
                            <CustomActionVegaLite
                                spec={spec}
                                data={data}
                                injectType={VEGA_LITE_DATA_INJECT_TYPE_B}
                            />
                        );
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

CartographyView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    tooltip: PropTypes.bool.isRequired,
    tooltipCategory: PropTypes.string.isRequired,
    tooltipValue: PropTypes.string.isRequired,
    colorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
    hoverColorScheme: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {
            data: {
                values: [],
            },
        };
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export default compose(injectData(), connect(mapStateToProps))(CartographyView);
