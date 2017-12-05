import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import Loading from '../../lib/components/Loading';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import GraphItem from './GraphItem';

const styles = {
    wrapper: {
        maxWidth: '100%',
    },
};

const PureGraphList = ({ graphList, loading, p: polyglot }) => {
    if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
    return (
        <div className="graph-list" style={styles.wrapper}>
            {graphList.map(field => (
                <GraphItem key={field.name} field={field} />
            ))}
        </div>
    );
};

PureGraphList.propTypes = {
    graphList: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

PureGraphList.defaultProps = {
    graphList: [],
    dataset: [],
};

const mapStateToProps = state => ({
    graphList: fromFields.getGraphFields(state),
});

const mapDispatchToProps = {};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    PureGraphList,
);
