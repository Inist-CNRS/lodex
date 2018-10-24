import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import ListIcon from 'material-ui/svg-icons/action/list';
import { fromFields } from '../../sharedSelectors';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropType,
} from '../../propTypes';

const styles = {
    link: {
        textDecoration: 'none',
        color: 'unset',
        display: 'block',
        width: '100%',
    },
};

const PureGraphSummary = ({ graphFields, closeDrawer, p: polyglot }) => (
    <div>
        <List>
            <ListItem
                value=""
                onClick={closeDrawer}
                containerElement={<Link style={styles.link} to="/graph" />}
                primaryText={polyglot.t('dataset')}
                leftIcon={<ListIcon />}
            />
            <Divider />
            {graphFields.map(field => (
                <ListItem
                    key={field.name}
                    value={field.name}
                    onClick={closeDrawer}
                    primaryText={
                        <Link style={styles.link} to={`/graph/${field.name}`}>
                            {field.label}
                        </Link>
                    }
                />
            ))}
        </List>
    </div>
);

PureGraphSummary.propTypes = {
    graphFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    selected: PropTypes.string.isRequired,
    closeDrawer: PropTypes.func.isRequired,
    p: polyglotPropType,
};

const mapStateToProps = state => ({
    graphFields: fromFields.getGraphFields(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(PureGraphSummary);
