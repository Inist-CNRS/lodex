import React, { Component } from 'react';
import injectData from '../../../injectData';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../../../propTypes';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import { CustomActionVega } from '../vega-component';
import deepClone from 'lodash.clonedeep';
import FlowMap from '../../models/FlowMap';
import { VEGA_DATA_INJECT_TYPE_B } from '../../../chartsUtils';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class FlowMapView extends Component {
    render() {
        const data = this.props.data;

        // Create a new flow map instance

        const flowMap = deepClone(new FlowMap());

        // return the finish chart
        return (
            <div style={styles.container}>
                {/* Make the chart responsive */}
                <ContainerDimensions>
                    {({ width }) => {
                        const spec = flowMap.buildSpec(width, this.props.p);
                        return (
                            <CustomActionVega
                                spec={spec}
                                data={data}
                                injectType={VEGA_DATA_INJECT_TYPE_B}
                            />
                        );
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

FlowMapView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    p: polyglotPropTypes.isRequired,
};

FlowMapView.defaultProps = {
    className: null,
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

export default compose(injectData(), connect(mapStateToProps))(FlowMapView);
