import PropTypes from 'prop-types';
// @ts-expect-error TS6133
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
                    <AppliedSearchFacet
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

AppliedSearchFacetListComponent.propTypes = {
    facets: PropTypes.arrayOf(PropTypes.any).isRequired,
    clearAll: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    facets: fromSearch.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(AppliedSearchFacetListComponent);
