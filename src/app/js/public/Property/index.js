import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { grey500 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';
import get from 'lodash.get';

import { fromResource, fromFormat } from '../selectors';
import { field as fieldPropTypes } from '../../propTypes';
import CompositeProperty from './CompositeProperty';
import propositionStatus, {
    REJECTED,
} from '../../../../common/propositionStatus';
import ModerateButton from './ModerateButton';
import { changeFieldStatus } from '../resource';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';
import { fromUser } from '../../sharedSelectors';
import EditButton from '../../fields/editFieldValue/EditButton';
import EditOntologyFieldButton from '../../fields/ontology/EditOntologyFieldButton';
import getFieldClassName from '../../lib/getFieldClassName';
import addSchemePrefix from '../../lib/addSchemePrefix';
import Format from '../Format';
import GraphLink from '../graph/GraphLink';
import Link from '../../lib/components/Link';
import { getPredicate } from '../../formats';

const styles = {
    container: memoize(
        (style, width) =>
            Object.assign(
                {
                    display: 'flex',
                    flexDirection: 'column',
                    width: `${width || 100}%`,
                },
                style,
            ),
        (style, value) => ({ style, value }),
    ),
    label: (status, isSub) => ({
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: isSub === true ? 'initial' : '2rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
    }),
    language: memoize(hide => ({
        marginRight: '1rem',
        fontSize: '0.6em',
        color: 'grey',
        textTransform: 'uppercase',
        visibility: hide ? 'hidden' : 'visible',
    })),
    scheme: {
        fontWeight: 'normale',
        fontSize: '0.75em',
        alignSelf: 'flex-end',
    },
    schemeLink: {
        color: 'grey',
    },
    editButton: memoize(hide => ({
        display: hide ? 'none' : 'inline-block',
    })),
    labelContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    valueContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    value: {
        flexGrow: 2,
        width: '100%',
        padding: '0.75rem',
        paddingLeft: '0px',
        textAlign: 'justify',
    },
};

const isEmpty = value =>
    value === null ||
    typeof value === 'undefined' ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

export const PropertyComponent = ({
    className,
    field,
    isSub,
    resource,
    fieldStatus,
    isAdmin,
    changeStatus,
    style,
    parents,
    formatData,
}) => {
    if (!isAdmin) {
        if (fieldStatus === REJECTED) {
            return null;
        }
        const value = resource[field.name];
        const predicate = getPredicate(field);
        if (!predicate(value, formatData) || isEmpty(value)) {
            return null;
        }
    }
    const fieldClassName = getFieldClassName(field);

    const formatChildren = [
        <Format
            key="format"
            className={classnames('property_value', fieldClassName)}
            field={field}
            resource={resource}
            fieldStatus={fieldStatus}
            graphLink={!!field.display_in_graph}
        />,
        <CompositeProperty
            key="composite"
            field={field}
            resource={resource}
            parents={parents}
        />,
        <PropertyLinkedFields
            key="linked-fields"
            fieldName={field.name}
            resource={resource}
            parents={parents}
        />,
    ];

    const formatName = get(field, 'format.name', 'none');
    const format = field.display_in_graph ? (
        <GraphLink link={`/graph/${field.name}`}>{formatChildren}</GraphLink>
    ) : (
        <div>{formatChildren}</div>
    );
    return (
        <div
            className={classnames(
                'property',
                fieldClassName,
                className,
                `format_${formatName}`,
            )}
            style={styles.container(style, field.width)}
        >
            <div className={classnames('property_label_container')}>
                <div style={styles.labelContainer}>
                    <span
                        className={classnames('property_label', fieldClassName)}
                        style={styles.label(fieldStatus, isSub)}
                    >
                        {field.label}
                        <span style={styles.editButton(!isAdmin)}>
                            <EditButton field={field} resource={resource} />
                            <EditOntologyFieldButton field={field} />
                        </span>
                    </span>
                    <span
                        className={classnames(
                            'property_scheme',
                            fieldClassName,
                        )}
                        style={styles.scheme}
                    >
                        <Link style={styles.schemeLink} href={field.scheme}>
                            {addSchemePrefix(field.scheme)}
                        </Link>
                    </span>
                </div>
                <PropertyContributor
                    fieldName={field.name}
                    fieldStatus={fieldStatus}
                />
            </div>
            <div
                className={classnames('property_value_container')}
                style={styles.valueContainer}
            >
                <div style={styles.value}>{format}</div>
                <span
                    className={classnames('property_language', fieldClassName)}
                    style={styles.language(!field.language)}
                >
                    {field.language || 'XX'}
                </span>
            </div>
            <ModerateButton
                fieldName={field.name}
                status={fieldStatus}
                changeStatus={changeStatus}
            />
        </div>
    );
};

PropertyComponent.propTypes = {
    changeStatus: PropTypes.func.isRequired,
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.oneOf(propositionStatus),
    isSub: PropTypes.bool,
    isAdmin: PropTypes.bool.isRequired,
    resource: PropTypes.shape({}).isRequired,
    parents: PropTypes.arrayOf(PropTypes.string).isRequired,
    style: PropTypes.object,
    formatData: PropTypes.any,
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
    isSub: false,
};

const mapStateToProps = (state, { field }) => ({
    isAdmin: fromUser.isAdmin(state),
    fieldStatus: fromResource.getFieldStatus(state, field),
    formatData: fromFormat.getFormatData(state, field.name),
});

const mapDispatchToProps = (dispatch, { field, resource: { uri } }) =>
    bindActionCreators(
        {
            changeStatus: (prevStatus, status) =>
                changeFieldStatus({
                    uri,
                    field: field.name,
                    status,
                    prevStatus,
                }),
        },
        dispatch,
    );

const Property = compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withProps(({ field, parents = [] }) => ({
        parents: [field.name, ...parents],
    })),
)(PropertyComponent);

export default Property;
