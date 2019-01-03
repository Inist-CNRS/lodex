import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import VegaLite from 'react-vega-lite';
import InvalidFormat from '../InvalidFormat';
import injectData from '../injectData';
import { field as fieldPropTypes } from '../../propTypes';

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
            spec = JSON.parse(specTemplate);
        } catch (e) {
            return <InvalidFormat format={field.format} value={e.message} />;
        }
        return (
            <div style={styles.container}>
                <VegaLite spec={spec || {}} data={data} />
            </div>
        );
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

export default compose(
    injectData(),
    connect(mapStateToProps),
)(VegaLiteView);
