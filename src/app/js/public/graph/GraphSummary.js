import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import translate from 'redux-polyglot/translate';

import { fromFields } from '../../sharedSelectors';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropType,
} from '../../propTypes';
import { getIconComponent } from '../../formats';
import { StyleSheet, css } from 'aphrodite/no-important';
import MixedChartIcon from './MixedChartIcon';

const styles = StyleSheet.create({
    link: {
        textDecoration: 'none',
        backgroundColor: 'white',
        fill: '#7DBD42',
        color: '#7DBD42',
        cursor: 'pointer',
        userSelect: 'none',
        textTransform: 'capitalize',
        ':hover': {
            textDecoration: 'none',
            fill: '#B22F90',
            color: '#B22F90',
        },
        ':focus': {
            textDecoration: 'none',
        },
        ':visited': {
            textDecoration: 'none',
        },
        ':active': {
            color: '#F48022',
            fill: '#F48022',
        },
    },
    all: {
        width: '100%',
        margin: 10,
        textAlign: 'center',
        fontSize: '2em',
        textTransform: 'uppercase',
    },
    item: {
        display: 'flex',
        width: 192,
        height: 192,
        margin: 10,
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        userSelect: 'none',
        textTransform: 'capitalize',
    },
    icon: {
        fontSize: '7em',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    label: {
        width: '100%',
    },
});

const PureGraphSummary = ({ graphFields, closeDrawer, p: polyglot }) => (
    <div className={classnames('graph-summary', css(styles.container))}>
        <Link
            className={classnames('all', css(styles.link), css(styles.all))}
            to={`/graph`}
            onClick={closeDrawer}
        >
            {polyglot.t('dataset')}
        </Link>
        {graphFields.map(field => {
            const Icon = getIconComponent(field);
            return (
                <Link
                    key={field.name}
                    className={classnames(
                        'graph-link',
                        css(styles.link),
                        css(styles.item),
                    )}
                    to={`/graph/${field.name}`}
                    onClick={closeDrawer}
                >
                    {Icon ? (
                        <Icon className={css(styles.icon)} />
                    ) : (
                        <MixedChartIcon className={css(styles.icon)} />
                    )}
                    <div className={css(styles.label)}>{field.label}</div>
                </Link>
            );
        })}
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
