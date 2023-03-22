import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import InvalidFormat from '../InvalidFormat';
import injectData from '../injectData';
import { field as fieldPropTypes } from '../../propTypes';
import { CustomActionVegaLite } from './component/vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from '../chartsUtils';
import ContainerDimensions from 'react-container-dimensions';

const styles = {
    container: {
        userSelect: 'none',
    },
};

class VegaLiteView extends Component {
    render() {
        const { field, data, specTemplate } = this.props;
        let spec;

        try {
            spec = JSON.parse(specTemplate);
        } catch (e) {
            return <InvalidFormat format={field.format} value={e.message} />;
        }

        return (
            <div style={styles.container}>
                <ContainerDimensions>
                    {({ width }) => {
                        if (spec !== undefined) {
                            if (this.props.width !== '')
                                spec.width = width * (this.props.width / 100);

                            if (this.props.height !== '')
                                spec.height = 300 * (this.props.height / 100);
                        }
                        return (
                            <CustomActionVegaLite
                                spec={spec || {}}
                                data={data}
                                injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                            />
                        );
                    }}
                </ContainerDimensions>
            </div>
        );
    }
}

VegaLiteView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    specTemplate: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
};

VegaLiteView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    if (!formatData) {
        return {};
    }
    return {
        data: {
            values: formatData,
        },
    };
};

export default compose(injectData(), connect(mapStateToProps))(VegaLiteView);
