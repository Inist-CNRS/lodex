import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash.get';

import LodexResource from '../shared/LodexResource';
import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';

const LodexResourceView = props => {
    const styles = StyleSheet.create({
        wrapper: {
            padding: '1.1em',
            borderRadius: '3px',
            background: 'white',
            boxShadow: '0px 6px 6px rgba(170, 170, 170, 0.25)',
        },
    });

    return (
        <div className={css(styles.wrapper)}>
            <LodexResource {...props} />
        </div>
    );
};

LodexResourceView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

LodexResourceView.defaultProps = {
    className: null,
};

const mapStateToProps = (state, { formatData = {} }) => {
    const { id, url, title, summary } = get(formatData, 'items[0]', {});

    return {
        id,
        url,
        title,
        summary,
    };
};

const isUrl = v =>
    (typeof v === 'string' &&
        (v.startsWith('http://') || v.startsWith('https://'))) ||
    false;

export default compose(
    translate,
    injectData(({ field, resource }) => {
        const value = resource[field.name];

        if (isUrl(value)) {
            return value;
        }
        return `/api/run/syndication/?$query[uri]=${encodeURIComponent(
            resource[field.name],
        )}`;
    }),
    connect(mapStateToProps),
)(LodexResourceView);
