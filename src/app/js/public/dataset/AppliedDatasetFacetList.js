import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fromDataset } from '../selectors';
import { facetActions } from '.';
import { Box, Chip } from '@mui/material';
import AppliedDatasetFacet from './AppliedDatasetFacet';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const AppliedDatasetFacetListComponent = ({
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
                    <AppliedDatasetFacet
                        key={name}
                        name={name}
                        facetValues={facetValues}
                    />
                ))}
                {facets.length && (
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

AppliedDatasetFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    facets: fromDataset.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(AppliedDatasetFacetListComponent);
