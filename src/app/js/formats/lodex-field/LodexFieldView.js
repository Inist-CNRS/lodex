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
    array: {
        flexGrow: '2',
        fontSize: '1.5rem',
        textDecoration: 'none',
        margin: 0,
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
    input1: {
        fontSize: '0.8em',
        width: '95%',
        borderImage: 'none',
    },
    icon: {
        cursor: 'default',
        verticalAlign: 'middle',
        width: '5%',
    },
    pointer: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        width: '5%',
    },
    link: {
        fontWeight: 'bold',
    },
};

const buildValue = (field, resource) => {
    let value;

    if (field.valueOfList) {
        value = field.valueOfList.trim();
    } else {
        value = resource[field.name];
    }

    return value;
};

export class LodexFieldView extends Component {
    getValue = () => {
        const { field, resource } = this.props;
        return buildValue(field, resource);
    };

    ifArray = value => {
        const { className } = this.props;
        if (Array.isArray(value)) {
            return (
                <span
                    className={('lodex_field_value_array', className)}
                    style={styles.array}
                >
                    <ul>
                        {value.map((data, key) => {
                            return <li key={key}>{this.ifUrl(data)}</li>;
                        })}
                    </ul>
                </span>
            );
        }
        return (
            <span
                className={('lodex_field_value', className)}
                style={styles.value}
            >
                {this.ifUrl(value)}
            </span>
        );
    };

    ifLang = value => {
        const { className } = this.props;
        if (value) {
            return (
                <span
                    className={('lodex_field_lang', className)}
                    style={styles.lang}
                >
                    {value}
                </span>
            );
        }
        return;
    };

    ifUrl = value => {
        if (isURL(value)) {
            return <a href={value}>{value}</a>;
        }

        return <span>{value}</span>;
    };

    loadContent = label => {
        const { className, formatData } = this.props;
        const data = formatData[0].fields.find(data => data.name == label);
        return (
            <div>
                <span
                    className={('lodex_field_label', className)}
                    style={styles.label}
                >
                    {data.label} : &#160;
                </span>
                {this.ifArray(data.value)}
                {this.ifLang(data.language)}
            </div>
        );
    };
    openIfUrl = () => {
        const requestText = this.getValue();

        if (isURL(requestText)) {
            window.location.replace(requestText);
        }
    };

    getHeaderFormat = () => {
        const { field } = this.props;
        const linkText = this.getValue();
        if (!field.format.args.param.hiddenInfo) {
            return (
                <div>
                    <a
                        className="link_to_resource"
                        style={styles.link}
                        href={linkText}
                    >
                        {linkText}
                    </a>
                </div>
            );
        }

        return null;
    };

    render() {
        const { className, formatData, field } = this.props;
        if (formatData === undefined) {
            return <span> </span>;
        }

        const labelArray = field.format.args.param.labelArray.map(e =>
            e.trim(),
        );

        return (
            <div className={className} style={styles.container}>
                {this.getHeaderFormat()}
                {labelArray.map(label => {
                    return this.loadContent(label);
                })}
            </div>
        );
    }
}

LodexFieldView.propTypes = {
    className: PropTypes.string,
    formatData: PropTypes.arrayOf(PropTypes.object),
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

LodexFieldView.defaultProps = {
    className: null,
};

export default compose(
    translate,
    injectData(({ field, resource }) => {
        const value = buildValue(field, resource);
        // @TODO crash à partir d'ici
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
                    pathname: '/api/export/jsonallvalue',
                    search: '?uri=' + uri,
                };
                return URL.format(target);
            }
            return value;
        }
        return '/api/export/jsonallvalue/?uri=' + resource[field.name];
    }),
)(LodexFieldView);
