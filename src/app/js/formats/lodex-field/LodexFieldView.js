import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import URL from 'url';

import { isURL } from '../../../../common/uris.js';
import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';

const styles = {
    container: {
        paddingLeft: '2rem',
        marginBottom: '10px',
        marginRight: '1em',
        marginLeft: '2rem',
        borderLeft: '1px dotted',
        borderColor: '#9e9ea6',
    },
    label: {
        color: 'rgb(158, 158, 158)',
        flexGrow: '2',
        fontSize: '1.5rem',
        textDecoration: 'none',
    },
    value: {
        flexGrow: '2',
        fontSize: '1.5rem',
        textDecoration: 'none',
    },
    lang: {
        display: 'inline-block',
        marginRight: '1rem',
        marginLeft: '1rem',
        fontSize: '0.6em',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: 'grey',
        textTransform: 'uppercase',
        visibility: 'visible',
    },
};

export class LodexResourceView extends Component {
    loadContent = label => {
        const { className, formatData } = this.props;
        return formatData[0].fields.map((data, key) => {
            if (label == data.name) {
                return (
                    <div key={key}>
                        <span
                            className={('lodex_field_label', className)}
                            style={styles.label}
                        >
                            {data.label} : &#160;
                        </span>
                        <span
                            className={('lodex_field_value', className)}
                            style={styles.value}
                        >
                            {data.value}
                        </span>
                        <span
                            className={('lodex_field_lang', className)}
                            style={styles.lang}
                        >
                            {data.lang}
                        </span>
                    </div>
                );
            } else {
                return null;
            }
        });
    };

    render() {
        const { className, formatData, param } = this.props;
        if (formatData == undefined) {
            return <span> </span>;
        }
        let labelArray = param.labelArray.map(e => e.trim()); //clean string

        return (
            <div className={className} style={styles.container}>
                {labelArray.map(label => {
                    return this.loadContent(label);
                })}
            </div>
        );
    }
}

LodexResourceView.propTypes = {
    className: PropTypes.string,
    formatData: PropTypes.arrayOf(PropTypes.object),
    param: PropTypes.object,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

LodexResourceView.defaultProps = {
    className: null,
};

export default compose(
    translate,
    injectData(({ field, resource }) => {
        const value = resource[field.name];

        if (!value) {
            return null;
        }

        if (isURL(value)) {
            const source = URL.parse(value);
            if (source.pathname.search(/^\/\w+:/) === 0) {
                const uri = source.pathname.slice(1);
                const target = {
                    protocol: source.protocol,
                    hostname: source.hostname,
                    slashes: source.slashes,
                    port: source.port,
                    pathname: '/api/export/json',
                    search: '?uri=' + uri,
                };
                return URL.format(target);
            }
            return value;
        }
        return `/api/run/json-document/?$query[uri]=${encodeURIComponent(
            resource[field.name],
        )}`;
    }),
)(LodexResourceView);
