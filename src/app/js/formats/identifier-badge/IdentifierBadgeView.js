import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import { field as fieldPropTypes } from '../../propTypes';
import { resolvers } from '.';

const IdentifierBadgeView = ({ resource, field, typid, colors }) => {
    const colorsSet = String(colors)
        .split(/[^\w]/)
        .filter(x => x.length > 0)
        .map(x => String('#').concat(x));
    const firstColor = colorsSet.shift() || '#8B8B8B';
    const resolver = resolvers[typid] || '';
    const identifier = resource[field.name].replace(resolver, '');
    const target = resolver + identifier;

    const styles = StyleSheet.create({
        label: {},
        key: {
            float: 'left',
            margin: '0',
            padding: '2px 7px',
            color: 'white',
            fontFamily: 'sans-serif',
            fontWeight: '300',
            fontSize: '14px',
            textShadow: '0.5px 0.5px rgba(10, 10, 10, 0.4)',
            background:
                'linear-gradient(to bottom, rgba(63, 76, 107, 0.01) 0%, rgba(18, 19, 30, 0.5) 100%)',
            backgroundColor: '#555',
            borderRadius: '5px 0 0 5px',
        },
        value: {
            float: 'left',
            margin: '0',
            padding: '2px 7px',
            color: 'white',
            fontFamily: 'sans-serif',
            fontWeight: '300',
            fontSize: '14px',
            background:
                'linear-gradient(to bottom, rgba(63, 76, 107, 0.01) 50%, rgba(18, 19, 30, 0.2) 100%)',
            textShadow: '0.5px 0.5px rgba(10, 10, 10, 0.4)',
            backgroundColor: firstColor,
            borderRadius: '0 5px 5px 0',
        },
    });

    return (
        <a href={target} className={css(styles.label)}>
            <span className={css(styles.key)}>{typid}</span>
            <span className={css(styles.value)}>{identifier}</span>
        </a>
    );
};

IdentifierBadgeView.propTypes = {
    field: fieldPropTypes.isRequired,
    typid: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default IdentifierBadgeView;
