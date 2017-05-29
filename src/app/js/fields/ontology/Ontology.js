import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import fetch from 'isomorphic-fetch';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import { fromUser, fromFields } from '../../sharedSelectors';
import { languages } from '../../../../../config.json';
import getFieldClassName from '../../lib/getFieldClassName';
import EditOntologyField from './EditOntologyField';
import ExportFieldsButton from '../../public/export/ExportFieldsButton';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '3rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
    exportContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '3rem',
    },
    field: memoize(hasBorder => ({
        borderBottom: hasBorder ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingBottom: '1rem',
        paddingTop: '1rem',
        display: 'flex',
    })),
    name: {
        marginTop: '1rem',
        marginBottom: '1rem',
        fontStyle: 'italic',
    },
    property: {
        display: 'flex',
        marginLeft: '3rem',
        marginBottom: '0.5rem',
    },
    label: {
        marginRight: '1rem',
        minWidth: '10rem',
        textAlign: 'right',
    },
    icon: { color: 'black' },
};


export class OntologyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { fieldsToCount: [] };
    }

    componentDidMount() {
        const fieldsToCount = this.props.fields
            .filter(field => field.cover !== 'dataset')
            .map(field => 'field='.concat(field.name))
            .join('&');
        const apiURL = '/api/reduce/count?'.concat(fieldsToCount);
        fetch(apiURL)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const data = json.data.reduce((o, c) => {
                        const { _id, value } = c;
                        return { ...o, [_id]: value };
                    }, {});
                    this.setState({ fieldsToCount: data });
                });
            });
    }

    render() {
        const { fields, isLoggedIn, p: polyglot } = this.props;
        const { fieldsToCount } = this.state;
        return (
            <div className="ontology" style={styles.container}>
                {isLoggedIn &&
                    <div style={styles.exportContainer}>
                        <ExportFieldsButton iconStyle={styles.icon} />
                    </div>
                }
                {fields.map((field, index) => (
                    <div key={field.name} style={styles.field(index < fields.length - 1)}>

                        <div>
                            <h4
                                className={classnames('field-label', getFieldClassName(field))}
                                style={styles.name}
                            >
                                {field.label}
                            </h4>
                            <dl style={styles.property}>
                                <dt style={styles.label}>{polyglot.t('count_of_field')}</dt>
                                <dd
                                    className={classnames('field-count', getFieldClassName(field))}
                                >
                                    {fieldsToCount[field.name] || 1}
                                </dd>
                            </dl>
                            {field.scheme &&
                                <dl style={styles.property}>
                                    <dt style={styles.label}>{polyglot.t('scheme')}</dt>
                                    <dd
                                        className={classnames('field-scheme', getFieldClassName(field))}
                                    >
                                        {field.scheme}
                                    </dd>
                                </dl>
                            }
                            <dl style={styles.property}>
                                <dt style={styles.label}>{polyglot.t('cover')}</dt>
                                <dd
                                    className={classnames('field-cover', getFieldClassName(field))}
                                >
                                    {polyglot.t(`cover_${field.cover}`)}
                                </dd>
                            </dl>
                            {field.language &&
                                <dl style={styles.property}>
                                    <dt style={styles.label}>{polyglot.t('language')}</dt>
                                    <dd
                                        className={classnames('field-language', getFieldClassName(field))}
                                    >
                                        {languages.find(l => l.code === field.language).label}
                                    </dd>
                                </dl>
                            }
                            <dl style={styles.property}>
                                <dt style={styles.label}>{polyglot.t('identifier')}</dt>
                                <dd
                                    className={classnames('field-identifier', getFieldClassName(field))}
                                >
                                    {field.name}
                                </dd>
                            </dl>
                        </div>
                        <EditOntologyField field={field} />
                    </div>
                ))}
            </div>
        );
    }
}

OntologyComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
    isLoggedIn: fromUser.isLoggedIn(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(OntologyComponent);
