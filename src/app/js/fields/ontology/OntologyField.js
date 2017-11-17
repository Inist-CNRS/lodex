import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import EditOntologyField from './EditOntologyField';
import { fromFields } from '../../sharedSelectors';
import { languages } from '../../../../../config.json';
import getFieldClassName from '../../lib/getFieldClassName';

const styles = {
    field: memoize(hasBorder => ({
        borderBottom: hasBorder ? '1px solid rgb(224, 224, 224)' : 'none',
        backgroundColor: 'white',
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
    badge: {
        fontFamily: '"Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma, Sans-Serif',
        fontSize: '70%',
        fontWeight: '700',
        textTransform: 'uppercase',
        padding: '2px 3px 1px 3px',
        marginLeft: '4px',
        color: '#FFFFFF',
        borderRadius: '3px',
        position: 'relative',
        top: '-4px',
        textShadow: 'none !important',
        whiteSpace: 'nowrap',
        backgroundColor: '#8B8B8B',
    },
};

const OntologyFieldComponent = ({ field, fields, index, p: polyglot }) => (
    <div key={field.name} style={styles.field(index < fields.length - 1)}>
        <div>
            <h4
                className={classnames('field-label', getFieldClassName(field))}
                style={styles.name}
            >
                {field.label}
                {field.overview === 1 &&
                <span style={styles.badge}>title</span>
                }
                {field.overview === 2 &&
                <span style={styles.badge}>description</span>
                }
            </h4>
            <dl style={styles.property}>
                <dt style={styles.label}>{polyglot.t('count_of_field')}</dt>
                <dd
                    className={classnames('field-count', getFieldClassName(field))}
                >
                    {field.count || 1}
                </dd>
            </dl>
            {field.scheme &&
                <dl style={styles.property}>
                    <dt style={styles.label}>{polyglot.t('scheme')}</dt>
                    <dd
                        className={classnames('field-scheme', getFieldClassName(field))}
                    >
                        <a href={field.scheme}>{field.scheme}</a>
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
);

OntologyFieldComponent.propTypes = {
    field: React.PropTypes.shape({}),
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
    index: PropTypes.number.isRequired,
};

OntologyFieldComponent.defaultProps = {
    field: {},
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

export default compose(
    connect(mapStateToProps, undefined),
    translate,
)(OntologyFieldComponent);
