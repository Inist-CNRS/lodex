import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    ListItem,
    Checkbox,
    FormControlLabel,
    ListItemText,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { translate, useTranslate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';

import FacetActionsContext from './FacetActionsContext';
import { fromFacet } from '../selectors';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    count: {
        alignSelf: 'flex-start',
        paddingTop: '5px',
    },
    listItem: {
        fontSize: '1rem',
        padding: 0,
    },
};

const onCheck = (toggleFacetValue, name, facetValue) => () =>
    toggleFacetValue({ name, facetValue });

export const FacetValueItemView = ({ name, facetValue, isChecked }) => {
    const { translate } = useTranslate();
    if (facetValue.value instanceof Object) {
        return (
            <ListItem className="facet-value-item" sx={styles.listItem}>
                <ListItemText>
                    <div style={{ display: 'flex' }}>
                        <ErrorIcon sx={{ marginRight: 6 }} />
                        {translate('facet_invalid_format')}
                    </div>
                </ListItemText>
            </ListItem>
        );
    }

    return (
        <FacetActionsContext.Consumer>
            {({ toggleFacetValue }) => (
                <ListItem className="facet-value-item" sx={styles.listItem}>
                    <ListItemText>
                        <div style={styles.container}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={onCheck(
                                            toggleFacetValue,
                                            name,
                                            facetValue,
                                        )}
                                    />
                                }
                                label={
                                    facetValue.value === '' ||
                                    facetValue.value === null
                                        ? translate('empty')
                                        : facetValue.value
                                }
                            >
                                <span style={styles.count}>
                                    {facetValue.count}
                                </span>
                            </FormControlLabel>
                        </div>
                    </ListItemText>
                </ListItem>
            )}
        </FacetActionsContext.Consumer>
    );
};

FacetValueItemView.propTypes = {
    name: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    facetValue: PropTypes.shape({
        value: PropTypes.string,
        count: PropTypes.number,
        id: PropTypes.string,
    }).isRequired,
};

const mapStateToProps = (state, { name, facetValue, page }) => ({
    isChecked: fromFacet(page).isFacetValuesChecked(state, {
        name,
        facetValue,
    }),
});

export default compose(translate, connect(mapStateToProps))(FacetValueItemView);
