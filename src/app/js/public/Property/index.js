import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { grey } from '@material-ui/core/colors';
import memoize from 'lodash.memoize';
import get from 'lodash.get';

import { fromResource } from '../selectors';
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
import shouldDisplayField from '../../fields/shouldDisplayField';

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
        color: grey[500],
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: isSub === true ? '1rem' : '1.25rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
        fontFamily: 'Quicksand, sans-serif',
    }),
    language: memoize(hide => ({
        marginRight: '1rem',
        fontSize: '0.6rem',
        color: 'grey',
        textTransform: 'uppercase',
        visibility: hide ? 'hidden' : 'visible',
    })),
    scheme: {
        fontWeight: 'normale',
        fontSize: '0.75rem',
        alignSelf: 'flex-end',
    },
    schemeLink: {
        color: 'grey',
    },
    editButton: {
        display: 'inline-block',
    },
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
        padding: '0.75rem 0.75rem 0.75rem 0',
        textAlign: 'justify',
    },
};

export const PropertyComponent = ({
    className,
    field,
    predicate,
    isSub,
    resource,
    fieldStatus,
    isAdmin,
    changeStatus,
    style,
    parents,
}) => {
    if (!shouldDisplayField(resource, field, fieldStatus, predicate, isAdmin)) {
        return null;
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
                        {isAdmin && (
                            <span style={styles.editButton}>
                                <EditButton field={field} resource={resource} />
                                <EditOntologyFieldButton field={field} />
                            </span>
                        )}
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
    predicate: PropTypes.func,
    isSub: PropTypes.bool,
    isAdmin: PropTypes.bool.isRequired,
    resource: PropTypes.shape({}).isRequired,
    parents: PropTypes.arrayOf(PropTypes.string).isRequired,
    style: PropTypes.object,
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
    predicate: () => true,
    isSub: false,
};

const mapStateToProps = (state, { field }) => ({
    isAdmin: fromUser.isAdmin(state),
    fieldStatus: fromResource.getFieldStatus(state, field),
    predicate: getPredicate(field),
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
    connect(mapStateToProps, mapDispatchToProps),
    withProps(({ field, parents = [] }) => ({
        parents: [field.name, ...parents],
    })),
)(PropertyComponent);

export default Property;
