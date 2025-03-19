import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Box, Chip } from '@mui/material';
import { compose } from 'recompose';
import { translate } from '../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromSearch } from '../selectors';
import AppliedSearchFacet from './AppliedSearchFacet';
import { facetActions } from './reducer';

export const AppliedSearchFacetListComponent = ({
    facets,
    clearAll,
    p: polyglot,
}) => (
    <Box className="applied-facet-container">
        {facets.length ? (
            <Box
                sx={{
                    margin: '10px 0',
                    display: 'flex',
                    flexFlow: 'row wrap',
                    width: '100%',
                }}
            >
                {facets.map(({ name, value: facetValues }) => (
                    <AppliedSearchFacet
                        key={name}
                        name={name}
                        facetValues={facetValues}
                    />
                ))}
                {facets.length > 0 && (
                    <Chip
                        sx={{ margin: '5px' }}
                        onClick={clearAll}
                        label={polyglot.t('clear_all')}
                    />
                )}
            </Box>
        ) : null}
    </Box>
);

AppliedSearchFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state) => ({
    facets: fromSearch.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(AppliedSearchFacetListComponent);
