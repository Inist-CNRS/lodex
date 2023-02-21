import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropType } from '../../propTypes';
import { Box, Button, Tooltip } from '@mui/material';

import { fromFacet } from '../selectors';
import { connect } from 'react-redux';

import apiFacet from '../../admin/api/facet';
import { facetActions } from '../search/reducer';
import { MAX_VALUE_FOR_ALL_FACET } from '.';

const FacetValueAll = ({
    disabled = false,
    facetData,
    name,
    p: polyglot,
    setAllValueForFacet,
}) => {
    const handleChange = async () => {
        const result = await apiFacet.getFacetsFiltered({
            field: name,
            ...facetData,
            perPage: MAX_VALUE_FOR_ALL_FACET,
        });
        setAllValueForFacet({ name, values: result.data.map(d => d.value) });
    };
    return (
        <Tooltip
            placement="left"
            title={
                disabled
                    ? polyglot.t('check_all_value_facet_tooltip', {
                          limit: MAX_VALUE_FOR_ALL_FACET,
                      })
                    : ''
            }
        >
            <Box sx={{ fontSize: '1rem', padding: 0, margin: 0 }}>
                <Button
                    onClick={handleChange}
                    variant="link"
                    disabled={disabled}
                    sx={{ paddingX: 0 }}
                >
                    {polyglot.t('check_all_value_facet')}
                </Button>
            </Box>
        </Tooltip>
    );
};

FacetValueAll.propTypes = {
    disabled: PropTypes.bool,
    facetData: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    p: polyglotPropType.isRequired,
    setAllValueForFacet: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { name }) => {
    const selectors = fromFacet('search');
    return {
        facetData: selectors.getFacetValueRequestData(state, name),
    };
};

const mapDispatchToProps = {
    setAllValueForFacet: facetActions.setAllValueForFacet,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(FacetValueAll);
