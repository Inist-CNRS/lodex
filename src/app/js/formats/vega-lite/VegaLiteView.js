import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import VegaLite from 'react-vega-lite';
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
        const { formatData, specTemplate } = this.props;
        const spec = JSON.parse(specTemplate);

        return (
            <div style={styles.container}>
                <VegaLite spec={spec} data={formatData} />
            </div>
        );
    }
}

VegaLiteView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    formatData: PropTypes.any,
    specTemplate: PropTypes.string.isRequired,
};

VegaLiteView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData }) => {
    return {
        formatData,
    };
};

export default compose(
    injectData(),
    connect(mapStateToProps),
)(VegaLiteView);
