import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import { resolvers } from '.';
import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname({
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
        borderRadius: '0 5px 5px 0',
    },
});

const getColorStyle = color => ({
    backgroundColor: color,
});

const IdentifierBadgeView = ({ resource, field, typid, colors }) => {
    const colorsSet = String(colors)
        .split(/[^\w]/)
        .filter(x => x.length > 0)
        .map(x => String('#').concat(x));
    const firstColor = colorsSet.shift() || '#8B8B8B';
    const resolver = resolvers[typid] || '';
    const value = resource[field.name] || '';

    const identifier = value.replace(resolver, '');
    const target = resolver + identifier;

    return (
        <Link href={target}>
            <span className={styles.key}>{typid}</span>
            <span className={styles.value} style={getColorStyle(firstColor)}>
                {identifier}
            </span>
        </Link>
    );
};

IdentifierBadgeView.propTypes = {
    field: fieldPropTypes.isRequired,
    typid: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default IdentifierBadgeView;
