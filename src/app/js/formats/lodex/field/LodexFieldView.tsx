import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../../../i18n/I18NContext';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import URL from 'url';

import { isURL } from '../../../../../common/uris';
import { field as fieldPropTypes } from '../../../propTypes';
import injectData from '../../injectData';
import Link from '../../../lib/components/Link';

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
        fontSize: '1rem',
        textDecoration: 'none',
    },
    value: {
        flexGrow: '2',
        fontSize: '1rem',
        textDecoration: 'none',
    },
    array: {
        flexGrow: '2',
        fontSize: '1rem',
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

// @ts-expect-error TS7006
const buildValue = (field, resource) => {
    return field.valueOfList ? field.valueOfList.trim() : resource[field.name];
};

export class LodexFieldView extends Component {
    getValue = () => {
        // @ts-expect-error TS2339
        const { field, resource } = this.props;
        return buildValue(field, resource);
    };

    // @ts-expect-error TS7006
    ifArray = (value) => {
        // @ts-expect-error TS2339
        const { className } = this.props;
        if (Array.isArray(value)) {
            return (
                <span
                    // @ts-expect-error TS2695
                    className={('lodex_field_value_array', className)}
                    // @ts-expect-error TS2322
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
                // @ts-expect-error TS2695
                className={('lodex_field_value', className)}
                // @ts-expect-error TS2322
                style={styles.value}
            >
                {this.ifUrl(value)}
            </span>
        );
    };

    // @ts-expect-error TS7006
    ifLang = (value) => {
        // @ts-expect-error TS2339
        const { className } = this.props;
        if (value) {
            return (
                <span
                    // @ts-expect-error TS2695
                    className={('lodex_field_lang', className)}
                    // @ts-expect-error TS2322
                    style={styles.lang}
                >
                    {value}
                </span>
            );
        }
        return;
    };

    // @ts-expect-error TS7006
    ifUrl = (value) => {
        if (isURL(value)) {
            // @ts-expect-error TS2739
            return <Link href={value}>{value}</Link>;
        }

        return <span>{value}</span>;
    };

    // @ts-expect-error TS7006
    loadContent = (label, key) => {
        // @ts-expect-error TS2339
        const { className, formatData } = this.props;
        if (!label) {
            return;
        }

        // @ts-expect-error TS7006
        const data = formatData[0].fields.find((data) => data.name == label);
        if (!data) {
            return;
        }
        return (
            <div key={key}>
                <span
                    // @ts-expect-error TS2695
                    className={('lodex_field_label', className)}
                    // @ts-expect-error TS2322
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
        // @ts-expect-error TS2339
        const { field } = this.props;
        const linkText = this.getValue();
        if (!field.format.args.param.hiddenInfo) {
            return (
                <div>
                    <a
                        className="link_to_resource"
                        // @ts-expect-error TS2322
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
        // @ts-expect-error TS2339
        const { className, formatData, field } = this.props;
        if (formatData === undefined) {
            return <span> </span>;
        }

        // @ts-expect-error TS7006
        const labelArray = field.format.args.param.labelArray.map((e) =>
            e.trim(),
        );

        return (
            <div className={className} style={styles.container}>
                {this.getHeaderFormat()}
                {/*
                 // @ts-expect-error TS7006 */}
                {labelArray.map((label, key) => {
                    return this.loadContent(label, key);
                })}
            </div>
        );
    }
}

// @ts-expect-error TS2339
LodexFieldView.propTypes = {
    className: PropTypes.string,
    formatData: PropTypes.arrayOf(PropTypes.object),
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

// @ts-expect-error TS2339
LodexFieldView.defaultProps = {
    className: null,
};

export default compose(
    translate,
    // @ts-expect-error TS2345
    injectData(({ field, resource }) => {
        const value = buildValue(field, resource);

        if (!value) {
            return null;
        }

        if (!isURL(value)) {
            const newValue =
                '/api/export/format/jsonallvalue?uri=' + resource[field.name];
            return newValue;
        }

        const source = URL.parse(value);
        // @ts-expect-error TS18047
        if (source.pathname.search(/(ark|uid):/) >= 0) {
            const [check, tenant = 'default', scheme, identifier] =
                // @ts-expect-error TS18047
                source.pathname.split('/').filter(Boolean);
            let uri;
            let pathname;
            if (check === 'instance') {
                // Lodex  >= 14
                uri = `${scheme}/${identifier}`;
                pathname = '/api/export/format/jsonallvalue';
            } else {
                // lodex <= 12
                // @ts-expect-error TS18047
                uri = source.pathname.slice(1);
                pathname = '/api/export/jsonallvalue';
            }
            const target = {
                protocol: source.protocol,
                hostname: source.hostname,
                slashes: source.slashes,
                port: source.port,
                pathname,
                search: `?uri=${uri}&tenant=${tenant}`,
            };
            const newValue = URL.format(target);
            return newValue;
        }

        return value;
    }),
)(LodexFieldView);
