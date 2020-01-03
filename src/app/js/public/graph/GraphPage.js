import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import getTitle from '../../lib/getTitle';
import Graph from './Graph';

const GraphPage = ({ name, onSearch }) => (
    <>
        <Helmet>
            <title>Resources - {getTitle()}</title>
        </Helmet>
        <Graph className="graph-page" name={name} onSearch={onSearch} />
    </>
);

GraphPage.propTypes = {
    name: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

GraphPage.defaultProps = {
    name: null,
};

const mapStateToProps = (
    _,
    {
        match: {
            params: { name },
        },
    },
) => ({
    name,
});

export default compose(connect(mapStateToProps))(GraphPage);
