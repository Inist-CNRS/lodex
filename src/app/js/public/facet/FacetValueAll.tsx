// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import { polyglot as polyglotPropType } from '../../propTypes';
import { Box, Button } from '@mui/material';

import { fromFacet, fromDisplayConfig } from '../selectors';
import { connect } from 'react-redux';

import apiFacet from '../../admin/api/facet';
import { facetActions as datasetActions } from '../dataset';
import { facetActions as searchActions } from '../search/reducer';

const FacetValueAll = ({
    // @ts-expect-error TS7031
    facetData,
    // @ts-expect-error TS7031
    name,
    // @ts-expect-error TS7031
    p: polyglot,
    // @ts-expect-error TS7031
    setAllValueForFacet,
    // @ts-expect-error TS7031
    total,
    // @ts-expect-error TS7031
    maxCheckAllValue,
}) => {
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
                    ? polyglot.t('check_x_first_value_facet', {
                          limit: maxCheckAllValue,
                      })
                    : polyglot.t('check_all_value_facet')}
            </Button>
        </Box>
    );
};

FacetValueAll.propTypes = {
    facetData: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropType.isRequired,
    setAllValueForFacet: PropTypes.func.isRequired,
    page: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    maxCheckAllValue: PropTypes.number.isRequired,
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
            // @ts-expect-error TS2339
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
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    // @ts-expect-error TS2345
)(FacetValueAll);
