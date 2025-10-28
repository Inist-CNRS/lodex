import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
import compose from 'recompose/compose';
import { Box, Button } from '@mui/material';

import { fromFacet, fromDisplayConfig } from '../selectors';
import { connect } from 'react-redux';

import apiFacet from '../../../admin-app/src/api/facet';
import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';

type FacetValueAllProps = {
    facetData: {
        filter: string;
        sort?: Record<string, unknown>;
    };
    name: string;
    setAllValueForFacet(value: { name: string; values: unknown }): unknown;
    page: string;
    total: number;
    maxCheckAllValue: number;
};

const FacetValueAll = ({
    facetData,
    name,
    setAllValueForFacet,
    total,
    maxCheckAllValue,
}: FacetValueAllProps) => {
    const { translate } = useTranslate();
    const handleChange = async () => {
        const result = await apiFacet.getFacetsFiltered({
            field: name,
            ...facetData,
            currentPage: 0,
            perPage: maxCheckAllValue,
        });
        setAllValueForFacet({ name, values: result.data });
    };

    return (
        <Box sx={{ fontSize: '1rem', padding: 0, margin: 0 }}>
            {/*
             // @ts-expect-error TS2769 */}
            <Button onClick={handleChange} variant="link" sx={{ paddingX: 0 }}>
                {total > maxCheckAllValue
                    ? translate('check_x_first_value_facet', {
                          limit: maxCheckAllValue,
                      })
                    : translate('check_all_value_facet')}
            </Button>
        </Box>
    );
};

const actionsByPage = {
    dataset: datasetActions,
    search: searchActions,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { name, page }) => {
    const selectors = fromFacet(page);
    return {
        facetData: selectors.getFacetValueRequestData(state, name),
        total: selectors.getFacetValuesTotal(state, name),
        maxCheckAllValue:
            fromDisplayConfig.getMaxCheckAllFacetsValue(state)[page],
    };
};

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch, { page }) => ({
    // @ts-expect-error TS7019
    setAllValueForFacet: (...args) =>
        // @ts-expect-error TS7053
        dispatch(actionsByPage[page].setAllValueForFacet(...args)),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(FacetValueAll);
