import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListItem, Checkbox, FormControlLabel } from '@material-ui/core';

import { fromFacet } from '../selectors';
import FacetActionsContext from './FacetActionsContext';

const styles = {
    container: {
        display: 'flex',
    },
    count: {
        alignSelf: 'flex-start',
        paddingTop: '5px',
    },
    listItem: {
        fontSize: '1rem',
    },
    innerDiv: {
        padding: '0 5px',
    },
};

const onCheck = (toggleFacetValue, name, value) => () =>
    toggleFacetValue({ name, value });

const FacetValueItem = ({ name, value, count, isChecked }) => (
    <FacetActionsContext.Consumer>
        {({ toggleFacetValue }) => (
            <ListItem
                className="facet-value-item"
                style={styles.listItem}
                innerDivStyle={styles.innerDiv}
                primaryText={
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
                }
            />
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
