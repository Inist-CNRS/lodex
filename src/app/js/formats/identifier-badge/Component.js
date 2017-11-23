import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { field as fieldPropTypes } from '../../propTypes';

const IdentifierBadgeView = ({ resource, field }) => {
    const typid =
        field.format && field.format.args && field.format.args.typid
            ? field.format.args.typid
            : 'ID';
    const { colors } = field.format.args || { colors: '' };
    const colorsSet = String(colors)
        .split(/[^\w]/)
        .filter(x => x.length > 0)
        .map(x => String('#').concat(x));
    const firstColor = colorsSet.shift() || '#8B8B8B';
    const resolvers = {
        DOI: 'http://dx.doi.org/',
        PMID: 'https://www.ncbi.nlm.nih.gov/pubmed/',
    };
    const resolver = resolvers[typid] || '';
    const target = resolver + resource[field.name];

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
            <span className={css(styles.value)}>{resource[field.name]}</span>
        </a>
    );
};

IdentifierBadgeView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

IdentifierBadgeView.defaultProps = {
    className: null,
};
export default IdentifierBadgeView;
