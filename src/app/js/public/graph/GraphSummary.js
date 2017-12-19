import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

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

const PureGraphSummary = ({ graphFields, selected, p: polyglot }) => (
    <IconMenu
        value={selected}
        iconButtonElement={
            <FlatButton primary>
                {polyglot.t('graph_list').toUpperCase()}
            </FlatButton>
        }
    >
        <MenuItem
            value=""
            primaryText={
                <Link style={styles.link} to="/home">
                    {polyglot.t('home')}
                </Link>
            }
        />
        <MenuItem
            value=""
            primaryText={
                <Link style={styles.link} to="/graph">
                    {polyglot.t('dataset')}
                </Link>
            }
        />
        <Divider />
        {graphFields.map(field => (
            <MenuItem
                key={field.name}
                value={field.name}
                primaryText={
                    <Link style={styles.link} to={`/graph/${field.name}`}>
                        {field.label}
                    </Link>
                }
            />
        ))}
    </IconMenu>
);

PureGraphSummary.propTypes = {
    graphFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    selected: PropTypes.string.isRequired,
    p: polyglotPropType,
};

const mapStateToProps = state => ({
    graphFields: fromFields.getGraphFields(state),
});

export default compose(connect(mapStateToProps), translate)(PureGraphSummary);
