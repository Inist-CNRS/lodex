import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import getTitle from '../../lib/getTitle';
import Graph from './Graph';

// @ts-expect-error TS7031
const GraphPage = ({ name, onSearch, tenant }) => (
    <>
        <Helmet>
            <title>{getTitle(tenant, 'Resources')}</title>
        </Helmet>
        {/*
         // @ts-expect-error TS2322 */}
        <Graph className="graph-page" name={name} onSearch={onSearch} />
    </>
);

GraphPage.propTypes = {
    name: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    tenant: PropTypes.string,
};

GraphPage.defaultProps = {
    name: null,
};

const mapStateToProps = (
    // @ts-expect-error TS7006
    _,
    {
        match: {
            // @ts-expect-error TS7031
            params: { name },
        },
    },
) => ({
    name,
});

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps))(GraphPage);
