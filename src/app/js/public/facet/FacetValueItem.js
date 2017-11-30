import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';

const styles = {
    container: {
        display: 'flex',
    },
    count: {
        alignSelf: 'flex-start',
        paddingTop: '5px',
    },
    listItem: {
        fontSize: '1.5rem',
    },
    innerDiv: {
        padding: '0 5px',
    },
};

const PureFacetValueItem = ({ value, count }) => (
    <ListItem
        style={styles.listItem}
        innerDivStyle={styles.innerDiv}
        primaryText={
            <div style={styles.container}>
                <Checkbox label={value} />
                <span style={styles.count}>{count}</span>
            </div>
        }
    />
);

PureFacetValueItem.propTypes = {
    value: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchtoProps = {};

export default connect(mapStateToProps, mapDispatchtoProps)(PureFacetValueItem);
