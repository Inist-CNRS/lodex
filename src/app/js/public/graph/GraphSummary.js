import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';

import { fromFields } from '../../sharedSelectors';
import { field as fieldPropTypes } from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const PureGraphSummary = ({ graphFields }) => (
    <List style={styles.container}>
        <ListItem>
            <Link to="/graph/dataset">dataset</Link>
        </ListItem>
        {graphFields.map(field => (
            <ListItem key={field.name}>
                <Link to={`/graph/${field.name}`}>{field.label}</Link>
            </ListItem>
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
