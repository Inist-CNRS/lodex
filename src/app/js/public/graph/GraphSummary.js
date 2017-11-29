import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    link: {
        textDecoration: 'none',
        color: 'unset',
    },
};

const PureGraphSummary = ({ graphFields }) => (
    <List style={styles.container}>
        <Link style={styles.link} to="/graph">
            <ListItem>dataset</ListItem>
        </Link>
        <Divider />
        {graphFields.map(field => (
            <div key={field.name}>
                <Link style={styles.link} to={`/graph/${field.name}`}>
                    <ListItem>{field.label}</ListItem>
                </Link>
                <Divider />
            </div>
        ))}
    </List>
);

PureGraphSummary.propTypes = {
    graphFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
};

const mapStateToProps = state => ({
    graphFields: fromFields.getGraphFields(state),
});

export default connect(mapStateToProps)(PureGraphSummary);
