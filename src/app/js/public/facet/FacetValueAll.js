import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropType } from '../../propTypes';
import {
    Checkbox,
    FormControlLabel,
    ListItem,
    ListItemText,
} from '@mui/material';

import { fromFacet } from '../selectors';
import { connect } from 'react-redux';

import apiFacet from '../../admin/api/facet';
import { facetActions } from '../search/reducer';
import { MAX_VALUE_FOR_ALL_FACET } from '.';

const FacetValueAll = ({
    p: polyglot,
    name,
    facetData,
    setAllValueForFacet,
}) => {
    const [isChecked, setIsChecked] = React.useState(false);

    const handleChange = async () => {
        if (isChecked) {
            setAllValueForFacet({ name, values: [] });
            setIsChecked(!isChecked);
            return;
        }
        const result = await apiFacet.getFacetsFiltered({
            field: name,
            ...facetData,
            perPage: MAX_VALUE_FOR_ALL_FACET,
        });
        setAllValueForFacet({ name, values: result.data.map(d => d.value) });
        setIsChecked(!isChecked);
    };
    return (
        <ListItem sx={{ fontSize: '1rem', padding: 0, margin: 0 }}>
            <ListItemText>
                <FormControlLabel
                    control={<Checkbox checked={isChecked} color="warning" />}
                    label={
                        isChecked
                            ? polyglot.t('uncheck_all_value_facet')
                            : polyglot.t('check_all_value_facet')
                    }
                    onChange={handleChange}
                    color="warning"
                />
            </ListItemText>
        </ListItem>
    );
};

FacetValueAll.propTypes = {
    p: polyglotPropType.isRequired,
    name: PropTypes.string.isRequired,
    facetData: PropTypes.object.isRequired,
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
