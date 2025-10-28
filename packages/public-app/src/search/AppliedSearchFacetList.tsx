import { connect } from 'react-redux';

import { Box, Chip } from '@mui/material';
import { compose } from 'recompose';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
import { fromSearch } from '../selectors';
import AppliedSearchFacet from './AppliedSearchFacet';
import { facetActions } from './reducer';

type AppliedSearchFacetListComponentProps = {
    facets: any[];
    clearAll(...args: unknown[]): unknown;
};

export const AppliedSearchFacetListComponent = ({
    facets,
    clearAll,
}: AppliedSearchFacetListComponentProps) => {
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
    facets: fromSearch.getAppliedFacetList(state),
});

const mapDispatchToProps = {
    clearAll: () => facetActions.clearFacet(),
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(AppliedSearchFacetListComponent);
