import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SparqlRequest from '../SparqlRequest';
import { isURL } from '../../../../../common/uris.js';
import { field as fieldPropTypes } from '../../../propTypes';
import URL from 'url';
import toPairs from 'lodash.topairs';
import toSentenceCase from 'js-sentencecase';
import { getViewComponent } from '../../';
import Link from '../../../lib/components/Link';

const styles = {
    container2: {
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
    id: {
        display: 'inline-block',
    },
    value: {
        display: 'inline-block',
    },
    lang: {
        display: 'inline-block',
        marginRight: '1rem',
        fontSize: '0.6em',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: 'grey',
        textTransform: 'uppercase',
        visibility: 'visible',
    },
    show: {
        display: 'inline-block',
        color: 'rgb(158, 158, 158)',
        flexGrow: '2',
        fontWeight: 'bold',
        fontSize: '2rem',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    value_min: {
        display: 'inline-block',
        color: 'rgb(158, 158, 158)',
        fontSize: '1.3rem',
    },
    array: {
        flexGrow: '2',
        fontSize: '1.5rem',
        textDecoration: 'none',
        margin: 0,
    },
    imgDefault: {
        maxWidth: '900px',
    },
};

export class SparqlTextField extends Component {
    renderSubformatComponent = (attrData, subformat) => {
        const { field } = this.props;
        const { ViewComponent, args } = getViewComponent(subformat.sub);
        return (
            <ViewComponent
                resource={{ '0': attrData.value }}
                field={{
                    ...field,
                    name: '0',
                    format: {
                        name: subformat.sub,
                        args: subformat.option,
                    },
                }}
                {...args}
                {...subformat.option}
            />
        );
    };

    renderAttributeFormat = (attrName, attrData) => {
        const { sparql } = this.props;

        const subFormat = sparql.subformat.find(data => {
            return attrName == data.attribute.trim().replace(/^\?/, '');
        });

        if (subFormat) {
            return this.renderSubformatComponent(attrData, subFormat);
        }

        return this.renderDefaultAttributeFormat(attrData);
    };

    renderDefaultAttributeFormat = attrData => {
        const { className, sparql } = this.props;

        if (attrData.value.includes(sparql.separator)) {
            const values = attrData.value.split(sparql.separator);
            return (
                <ul
                    className={('value_sparql_array', className)}
                    style={styles.array}
                >
                    {values.map((data, key) => (
                        <li key={key}>
                            {this.renderAttributeValue(data, attrData.type)}
                        </li>
                    ))}
                </ul>
            );
        }
        return (
            <div className="value_sparql" style={styles.value}>
                {this.renderAttributeValue(attrData.value, attrData.type)}{' '}
                &#160;
            </div>
        );
    };

    renderAttributeValue = (value, type) => {
        if (isURL(value) && type == 'uri') {
            return <Link href={value}>{value}</Link>;
        }
        return <span>{value}</span>;
    };

    renderLang = attrData => {
        if (attrData['xml:lang'] != undefined) {
            return <span>{attrData['xml:lang']}</span>;
        }
        return null;
    };

    render() {
        const { className, formatData } = this.props;
        if (!formatData) {
            return null;
        }

        return (
            <div className={className}>
                {formatData.results.bindings.map((result, key) => {
                    return (
                        <div key={key} style={styles.container2}>
                            {toPairs(result).map(
                                ([attrName, attrData], index) => {
                                    if (!attrData.value) {
                                        return;
                                    }
                                    return (
                                        <div key={index}>
                                            <div style={styles.id}>
                                                <span
                                                    className="label_sparql"
                                                    style={styles.label}
                                                >
                                                    {toSentenceCase(attrName)}
                                                    &#160; : &#160;
                                                </span>
                                            </div>
                                            {this.renderAttributeFormat(
                                                attrName,
                                                attrData,
                                            )}
                                            <div
                                                className="lang_sparql property_language"
                                                style={styles.lang}
                                            >
                                                {this.renderLang(attrData)}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }
}

SparqlTextField.propTypes = {
    className: PropTypes.string,
    formatData: PropTypes.object,
    sparql: PropTypes.object,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

SparqlTextField.defaultProps = {
    className: null,
};

export default compose(
    translate,
    SparqlRequest(({ field, resource, sparql }) => {
        const value = resource[field.name];
        if (!value) {
            return null;
        }
        let builtURL = sparql.endpoint;
        if (!isURL(builtURL)) {
            builtURL = 'https://' + builtURL;
        }

        if (!builtURL.endsWith('?query=')) {
            builtURL += '?query=';
        }

        builtURL += encodeURIComponent(
            sparql.request
                .trim()
                .replace(/[\s\u200B]+/g, ' ')
                .replace(/[?]{2}/g, value.trim()),
        );
        builtURL = builtURL.replace(/LIMIT([%]20)+\d*/i, ''); //remove LIMIT with its var
        const request = builtURL + '%20LIMIT%20' + sparql.maxValue;
        if (isURL(request)) {
            const source = URL.parse(request);

            return URL.format(source);
        }
        return null;
    }),
)(SparqlTextField);
