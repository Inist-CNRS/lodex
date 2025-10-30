import { Component } from 'react';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';
import compose from 'recompose/compose';
import SparqlRequest from '../SparqlRequest';
import { isURL } from '@lodex/common';
import URL from 'url';
import toPairs from 'lodash/toPairs';
// @ts-expect-error TS7016
import toSentenceCase from 'js-sentencecase';
import { getViewComponent } from '../../../index';
import Link from '@lodex/frontend-common/components/Link';
import type { Field } from '../../../../fields/types';

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
        fontSize: '1rem',
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
        fontSize: '1.25rem',
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
        fontSize: '1rem',
        textDecoration: 'none',
        margin: 0,
    },
    imgDefault: {
        maxWidth: '900px',
    },
};

interface SparqlTextFieldProps {
    className?: string;
    formatData?: object;
    sparql?: object;
    field: Field;
    resource: object;
}

export class SparqlTextField extends Component<SparqlTextFieldProps> {
    // @ts-expect-error TS7006
    renderSubformatComponent = (attrData, subformat) => {
        const { field } = this.props;
        // @ts-expect-error TS2554
        const { ViewComponent, args } = getViewComponent(subformat.sub);
        return (
            <ViewComponent
                resource={{ 0: attrData.value }}
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

    // @ts-expect-error TS7006
    renderAttributeFormat = (attrName, attrData) => {
        const { sparql } = this.props;

        // @ts-expect-error TS7006
        const subFormat = sparql.subformat.find((data) => {
            return attrName === data.attribute.trim().replace(/^\?/, '');
        });

        if (subFormat) {
            return this.renderSubformatComponent(attrData, subFormat);
        }

        return this.renderDefaultAttributeFormat(attrData);
    };

    // @ts-expect-error TS7006
    renderDefaultAttributeFormat = (attrData) => {
        const { className, sparql } = this.props;

        // @ts-expect-error TS18048
        if (attrData.value.includes(sparql.separator)) {
            // @ts-expect-error TS18048
            const values = attrData.value.split(sparql.separator);
            return (
                <ul
                    // @ts-expect-error TS2695
                    className={('value_sparql_array', className)}
                    style={styles.array}
                >
                    {/*
                     // @ts-expect-error TS7006 */}
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

    // @ts-expect-error TS7006
    renderAttributeValue = (value, type) => {
        if (isURL(value) && type === 'uri') {
            return <Link href={value}>{value}</Link>;
        }
        return <span>{value}</span>;
    };

    // @ts-expect-error TS7006
    renderLang = (attrData) => {
        if (attrData['xml:lang'] !== undefined) {
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
                {/*
                 // @ts-expect-error TS7006 */}
                {formatData.results.bindings.map((result, key) => {
                    return (
                        <div key={key} style={styles.container2}>
                            {toPairs(result).map(
                                ([attrName, attrData], index) => {
                                    // @ts-expect-error TS2339
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
                                                // @ts-expect-error TS2322
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

export default compose(
    translate,
    // @ts-expect-error TS7031
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
        builtURL = builtURL.replace(/LIMIT([%]20)+\d*/i, ''); // remove LIMIT with its var
        const request = builtURL + '%20LIMIT%20' + sparql.maxValue;
        if (isURL(request)) {
            const source = URL.parse(request);

            return URL.format(source);
        }
        return null;
    }),
    // @ts-expect-error TS2345
)(SparqlTextField);
