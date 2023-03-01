import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    ListItem,
    Checkbox,
    FormControlLabel,
    ListItemText,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { polyglot as polyglotPropType } from '../../propTypes';

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

const FacetValueItem = ({ name, facetValue, isChecked, p: polyglot }) => {
    if (facetValue.value instanceof Object) {
        return (
            <ListItem className="facet-value-item" style={styles.listItem}>
                <ListItemText>
                    <div style={{ display: 'flex' }}>
                        <ErrorIcon style={{ marginRight: 6 }} />
                        {polyglot.t('facet_invalid_format')}
                    </div>
                </ListItemText>
            </ListItem>
        );
    }

    return (
        <FacetActionsContext.Consumer>
            {({ toggleFacetValue }) => (
                <ListItem className="facet-value-item" style={styles.listItem}>
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
                                    facetValue.value === ''
                                        ? polyglot.t('empty')
                                        : facetValue.value
                                }
                            />
                            <span style={styles.count}>{facetValue.count}</span>
                        </div>
                    </ListItemText>
                </ListItem>
            )}
        </FacetActionsContext.Consumer>
    );
};

FacetValueItem.propTypes = {
    name: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
    p: polyglotPropType.isRequired,
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

export default compose(translate, connect(mapStateToProps))(FacetValueItem);
