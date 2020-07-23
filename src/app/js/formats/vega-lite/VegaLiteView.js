import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import InvalidFormat from '../InvalidFormat';
import injectData from '../injectData';
import { field as fieldPropTypes } from '../../propTypes';
import { CustomActionVegaLite } from './component/vega-lite-component';
import { VEGA_LITE_DATA_INJECT_TYPE_A } from './chartsUtils';

const styles = {
    container: {
        overflow: 'hidden',
        userSelect: 'none',
    },
};

class VegaLiteView extends Component {
    render() {
        const { field, data, specTemplate } = this.props;
        let spec;

        try {
            spec = this.retroCompatibilityCheck(JSON.parse(specTemplate));
        } catch (e) {
            return <InvalidFormat format={field.format} value={e.message} />;
        }

        return (
            <div style={styles.container}>
                <CustomActionVegaLite
                    spec={spec || {}}
                    data={data}
                    injectType={VEGA_LITE_DATA_INJECT_TYPE_A}
                />
            </div>
        );
    }

    retroCompatibilityCheck(spec) {
        // eslint-disable-next-line no-prototype-builtins
        if (!spec.hasOwnProperty('data')) {
            spec.data = {
                name: 'values',
            };
        }
        return spec;
    }
}

VegaLiteView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    data: PropTypes.any,
    specTemplate: PropTypes.string.isRequired,
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
