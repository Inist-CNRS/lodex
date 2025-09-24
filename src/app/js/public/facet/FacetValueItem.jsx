import ErrorIcon from '@mui/icons-material/Error';
import {
    Checkbox,
    FormControlLabel,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate, useTranslate } from '../../i18n/I18NContext';

import { fromFacet } from '../selectors';
import FacetActionsContext from './FacetActionsContext';

const styles = {
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

    const label =
        facetValue.value === '' || facetValue.value === null
            ? translate('empty')
            : facetValue.value;

    return (
        <FacetActionsContext.Consumer>
            {({ toggleFacetValue }) => (
                <ListItem className="facet-value-item" sx={styles.listItem}>
                    <ListItemText
                        primaryTypographyProps={{
                            component: 'div',
                            sx: {
                                display: 'flex',
                            },
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isChecked}
                                    onChange={onCheck(
                                        toggleFacetValue,
                                        name,
                                        facetValue,
                                    )}
                                    inputProps={{
                                        'aria-label': label,
                                    }}
                                />
                            }
                            label={
                                <>
                                    <Typography component="span" flexGrow={1}>
                                        {label}
                                    </Typography>
                                    <Typography component="span">
                                        {facetValue.count}
                                    </Typography>
                                </>
                            }
                            sx={{
                                flex: 1,
                            }}
                            componentsProps={{
                                typography: {
                                    component: 'div',
                                    sx: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        flex: 1,
                                    },
                                },
                            }}
                        />
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
