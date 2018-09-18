import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import HomeIcon from 'material-ui/svg-icons/action/home';
import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { fromFields } from '../../sharedSelectors';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropType,
} from '../../propTypes';

const styles = {
    container: {
        float: 'left',
        marginLeft: '-5rem',
        marginTop: '-1rem',
    },
    link: {
        textDecoration: 'none',
        color: 'unset',
        display: 'block',
        width: '100%',
    },
};

const PureGraphSummary = ({ graphFields, selected, p: polyglot }) => (
    <div style={styles.container}>
        <IconMenu
            value={selected}
            iconButtonElement={
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
            <MenuItem
                value=""
                containerElement={<Link style={styles.link} to="/" />}
                primaryText={polyglot.t('home')}
                leftIcon={<HomeIcon />}
            />
            <MenuItem
                value=""
                containerElement={<Link style={styles.link} to="/graph" />}
                primaryText={polyglot.t('dataset')}
                leftIcon={<SearchIcon />}
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
    </div>
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
