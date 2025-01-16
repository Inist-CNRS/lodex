import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { grey } from '@mui/material/colors';
import memoize from 'lodash/memoize';
import get from 'lodash/get';
import translate from 'redux-polyglot/translate';

import { fromDisplayConfig, fromResource } from '../selectors';
import ModerateButton from './ModerateButton';
import { changeFieldStatus } from '../resource';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';
import { fromUser } from '../../sharedSelectors';
import getFieldClassName from '../../lib/getFieldClassName';
import addSchemePrefix from '../../lib/addSchemePrefix';
import Format from '../Format';
import GraphLink from '../graph/GraphLink';
import Link from '../../lib/components/Link';
import { getPredicate } from '../../formats';
import shouldDisplayField from '../../fields/shouldDisplayField';
import {
    SCOPE_GRAPHIC,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
} from '../../../../common/scope';
import CompositeProperty from './CompositeProperty';

import propositionStatus, {
    REJECTED,
} from '../../../../common/propositionStatus';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { Box, IconButton } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { extractTenantFromUrl } from '../../../../common/tools/tenantTools';

const styles = {
    container: memoize(
        (style, width) => ({
            display: 'flex',
            flexDirection: 'column',
            width: {
                xs: 'calc(100% - 2vw)',
                sm:
                    width === '50'
                        ? 'calc(100% - 2vw)'
                        : `calc(${width || 100}% - 2vw)`,
                md: `calc(${width || 100}% - 2vw)`,
            },
            ...style,
        }),
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
    language: {
        marginRight: '1rem',
        fontSize: '0.6rem',
        color: 'grey',
        textTransform: 'uppercase',
    },
    scheme: {
        fontWeight: 'normale',
        fontSize: '0.75rem',
        alignSelf: 'flex-end',
    },
    schemeLink: {
        color: 'grey',
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
    value: (dense) => ({
        flexGrow: 2,
        width: '100%',
        padding: {
            xs: dense ? '0' : '0.75rem 0.75rem 0.75rem 0',
            sm: dense ? '0.5rem 0.5rem 0.5rem 0' : '0.75rem 0.75rem 0.75rem 0',
        },
        textAlign: 'justify',
    }),
};

export const getEditFieldRedirectUrl = (fieldName, scope, subresourceId) => {
    const tenant = extractTenantFromUrl(window.location.href);

    if (scope === SCOPE_DOCUMENT) {
        if (subresourceId) {
            return `/instance/${tenant}/admin#/display/${SCOPE_DOCUMENT}/subresource/${subresourceId}/edit/${fieldName}`;
        } else {
            return `/instance/${tenant}/admin#/display/${SCOPE_DOCUMENT}/main/edit/${fieldName}`;
        }
    } else {
        return `/instance/${tenant}/admin#/display/${scope}/edit/${fieldName}`;
    }
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
    dense,
    isMultilingual,
}) => {
    if (!shouldDisplayField(resource, field, fieldStatus, predicate, isAdmin)) {
        return null;
    }

    const fieldClassName = getFieldClassName(field);

    const handleEditField = () => {
        const redirectUrl = getEditFieldRedirectUrl(
            field.name,
            field.scope,
            field.subresourceId,
        );
        window.open(redirectUrl, '_blank');
    };

    const formatChildren = [
        <Format
            key="format"
            className={classnames('property_value', fieldClassName)}
            field={field}
            resource={resource}
            fieldStatus={fieldStatus}
            graphLink={field.scope === SCOPE_GRAPHIC}
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
    const format =
        (field.scope === SCOPE_GRAPHIC && !field.completes) ||
        (field.scope === SCOPE_DATASET &&
            !field.completes &&
            field.format &&
            field.format.name === 'fieldClone') ? (
            <GraphLink link={`/graph/${field.name}`}>
                {formatChildren}
            </GraphLink>
        ) : (
            <div>{formatChildren}</div>
        );
    return (
        <Box
            className={classnames(
                'property',
                fieldClassName,
                className,
                `format_${formatName}`,
            )}
            sx={styles.container(style, field.width)}
        >
            <div className={classnames('property_label_container')}>
                <div style={styles.labelContainer}>
                    <span
                        className={classnames('property_label', fieldClassName)}
                        style={styles.label(fieldStatus, isSub)}
                    >
                        {field.label}
                        {isAdmin && (
                            <IconButton
                                onClick={handleEditField}
                                classnames={'edit-field-icon'}
                            >
                                <Settings
                                    sx={{
                                        fontSize: '1.2rem',
                                    }}
                                />
                            </IconButton>
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
                <Box sx={styles.value(dense)}>{format}</Box>
                {field.language && !isMultilingual && (
                    <span
                        className={classnames(
                            'property_language',
                            fieldClassName,
                        )}
                        style={styles.language}
                    >
                        {field.language}
                    </span>
                )}
            </div>
            <ModerateButton
                fieldName={field.name}
                status={fieldStatus}
                changeStatus={changeStatus}
            />
        </Box>
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
    p: polyglotPropTypes.isRequired,
    dense: PropTypes.bool,
    isMultilingual: PropTypes.bool,
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
    dense: fromDisplayConfig.isDense(state),
    isMultilingual: fromDisplayConfig.isMultilingual(state),
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
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    withProps(({ field, parents = [] }) => ({
        parents: [field.name, ...parents],
    })),
)(PropertyComponent);

export default Property;
