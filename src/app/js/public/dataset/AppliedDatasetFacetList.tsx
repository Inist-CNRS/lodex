// @ts-expect-error TS6133
import React from 'react';
import { connect } from 'react-redux';

import { Box, Chip } from '@mui/material';
import { compose } from 'recompose';
import { facetActions } from '.';
import { useTranslate } from '../../i18n/I18NContext';
import { fromDataset } from '../selectors';
import AppliedDatasetFacet from './AppliedDatasetFacet';

interface AppliedDatasetFacetListComponentProps {
    facets: any[];
    clearAll(...args: unknown[]): unknown;
}

export const AppliedDatasetFacetListComponent = ({
    facets,
    clearAll,
}: AppliedDatasetFacetListComponentProps) => {
    const { translate } = useTranslate();
    return (
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
                            // @ts-expect-error TS2322
                            name={name}
                            facetValues={facetValues}
                        />
                    ))}
                    {facets.length > 0 && (
                        <Chip
                            sx={{ margin: '5px' }}
                            onClick={clearAll}
                            label={translate('clear_all')}
                        />
                    )}
                </Box>
            ) : null}
        </Box>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    facets: fromDataset.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(AppliedDatasetFacetListComponent);
