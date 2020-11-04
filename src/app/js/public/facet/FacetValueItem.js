import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    ListItem,
    Checkbox,
    FormControlLabel,
    ListItemText,
} from '@material-ui/core';

import { fromFacet } from '../selectors';
import FacetActionsContext from './FacetActionsContext';

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

const onCheck = (toggleFacetValue, name, value) => () =>
    toggleFacetValue({ name, value });

const FacetValueItem = ({ name, value, count, isChecked }) => (
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
                                        value,
                                    )}
                                />
                            }
                            label={value}
                        />
                        <span style={styles.count}>{count}</span>
                    </div>
                </ListItemText>
            </ListItem>
        )}
    </FacetActionsContext.Consumer>
);

FacetValueItem.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    isChecked: PropTypes.bool.isRequired,
    page: PropTypes.oneOf(['dataset', 'search']).isRequired,
};

const mapStateToProps = (state, { name, value, page }) => ({
    isChecked: fromFacet(page).isFacetValuesChecked(state, { name, value }),
});

export default connect(mapStateToProps)(FacetValueItem);
