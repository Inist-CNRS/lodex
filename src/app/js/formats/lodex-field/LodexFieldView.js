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
};

export class LodexResourceView extends Component {
    toto = label => {
        const { className, formatData } = this.props;
        return formatData.map((data, key) => {
            if (label == data.id) {
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
                    return this.toto(label);
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
                    pathname: '/api/run/json-document/',
                    search: `?$query[uri]=${encodeURIComponent(uri)}`,
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
