import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Box, Chip } from '@mui/material';
import { compose } from 'recompose';
import { facetActions } from '.';
import { translate } from '../../i18n/I18NContext';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromDataset } from '../selectors';
import AppliedDatasetFacet from './AppliedDatasetFacet';

export const AppliedDatasetFacetListComponent = ({
    // @ts-expect-error TS7031
    facets,
    // @ts-expect-error TS7031
    clearAll,
    // @ts-expect-error TS7031
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
                {/*
                 // @ts-expect-error TS7031 */}
                {facets.map(({ name, value: facetValues }) => (
                    <AppliedDatasetFacet
                        key={name}
                        // @ts-expect-error TS2322
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

AppliedDatasetFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    facets: fromDataset.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(AppliedDatasetFacetListComponent);
