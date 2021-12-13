import { useEffect } from 'react';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export const EnrichmentSelectComponent = ({ enrichment, history }) => {
    const navigate = (history, location) => history.push(location);

    useEffect(() => {
        if (enrichment.loading) {
            return;
        }

        if (enrichment.enrichments.length > 0) {
            const redirect = {
                pathname: `/data/enrichment/${enrichment.enrichments[0]._id}`,
                state: {},
            };

            navigate(history, redirect);
        } else {
            const redirect = {
                pathname: `/data/enrichment/add`,
                state: {},
            };

            navigate(history, redirect);
        }
    }, [enrichment.loading]);

    return true;
};

EnrichmentSelectComponent.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
    }),
};

const mapStateToProps = state => ({
    enrichment: state.enrichment,
});

const mapDispatchToProps = {};

export default compose(
    translate,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentSelectComponent);
