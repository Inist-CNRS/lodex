import { grey } from '@mui/material/colors';
import classnames from 'classnames';
import get from 'lodash/get';
import memoize from 'lodash/memoize';
// @ts-expect-error TS6133
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { bindActionCreators } from 'redux';
import { translate } from '../../i18n/I18NContext';

import {
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../../../common/scope';
import { shouldDisplayField } from '../../fields/shouldDisplayField';
import { getPredicate } from '../../formats';
import addSchemePrefix from '../../lib/addSchemePrefix';
import Link from '../../lib/components/Link';
import getFieldClassName from '../../lib/getFieldClassName';
import { fromUser } from '../../sharedSelectors';
import Format from '../Format';
import GraphLink from '../graph/GraphLink';
import { changeFieldStatus } from '../resource';
import { fromDisplayConfig, fromResource } from '../selectors';
import CompositeProperty from './CompositeProperty';
import ModerateButton from './ModerateButton';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';

import {
    type PropositionStatus,
    REJECTED,
} from '../../../../common/propositionStatus';

import { Settings } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { extractTenantFromUrl } from '../../../../common/tools/tenantTools';
import { CreateAnnotationButton } from '../../annotation/CreateAnnotationButton';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';

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
    // @ts-expect-error TS7006
    label: (status, isSub) => ({
        color: grey[500],
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: isSub === true ? '1rem' : '1.25rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
        fontFamily: 'Quicksand, sans-serif',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '8px',
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
    // @ts-expect-error TS7006
    value: (dense, isListFormat) => ({
        flexGrow: 2,
        width: '100%',
        padding: {
            xs: dense ? '0' : '0.75rem 0.75rem 0.75rem 0',
            sm: dense ? '0.5rem 0.5rem 0.5rem 0' : '0.75rem 0.75rem 0.75rem 0',
        },
        textAlign: isListFormat ? undefined : 'justify',
    }),
};

// @ts-expect-error TS7006
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

interface PropertyComponentProps {
    changeStatus(status: PropositionStatus): void;
    className?: string;
    field: {
        name: string;
        format: {
            name: string;
            args: {
                value: string;
            };
        };
        composedOf?: {
            fields: string[];
        };
        scope: string;
        subresourceId?: string;
        completes?: boolean;
        label: string;
        scheme?: string;
        width?: string;
        language?: string;
    };
    fieldStatus: string;
    predicate?(value: unknown): boolean;
    isSub?: boolean;
    isAdmin: boolean;
    resource: Record<string, unknown>;
    parents: string[];
    style?: object;
    p: unknown;
    dense?: boolean;
    isMultilingual?: boolean;
}

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
}: PropertyComponentProps) => {
    const canAnnotate = useCanAnnotate();
    if (
        !shouldDisplayField(
            resource,
            field,
            fieldStatus,
            predicate,
            isAdmin,
            canAnnotate,
        )
    ) {
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
        // @ts-expect-error TS2322
        <CompositeProperty
            // @ts-expect-error TS2322
            key="composite"
            // @ts-expect-error TS2322
            field={field}
            // @ts-expect-error TS2322
            resource={resource}
            // @ts-expect-error TS2322
            parents={parents}
        />,
        // @ts-expect-error TS2322
        <PropertyLinkedFields
            // @ts-expect-error TS2322
            key="linked-fields"
            // @ts-expect-error TS2322
            fieldName={field.name}
            // @ts-expect-error TS2322
            resource={resource}
            // @ts-expect-error TS2322
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
                        id={`field-${field.name}`}
                    >
                        {field.label}
                        {isAdmin && (
                            // @ts-expect-error TS2769
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
                        <CreateAnnotationButton
                            field={field}
                            resource={resource}
                        />
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
                    // @ts-expect-error TS2322
                    fieldName={field.name}
                    fieldStatus={fieldStatus}
                />
            </div>
            <div
                className={classnames('property_value_container')}
                style={styles.valueContainer}
            >
                {/*
                 // @ts-expect-error TS2769 */}
                <Box sx={styles.value(dense, formatName === 'list')}>
                    {format}
                </Box>
                {field.language && !isMultilingual && (
                    <span
                        className={classnames(
                            'property_language',
                            fieldClassName,
                        )}
                        // @ts-expect-error TS2322
                        style={styles.language}
                    >
                        {field.language}
                    </span>
                )}
            </div>
            <ModerateButton
                // @ts-expect-error TS2322
                fieldName={field.name}
                status={fieldStatus}
                changeStatus={changeStatus}
            />
        </Box>
    );
};

PropertyComponent.defaultProps = {
    className: null,
    fieldStatus: null,
    predicate: () => true,
    isSub: false,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    isAdmin: fromUser.isAdmin(state),
    fieldStatus: fromResource.getFieldStatus(state, field),
    predicate: getPredicate(field),
    dense: fromDisplayConfig.isDense(state),
    isMultilingual: fromDisplayConfig.isMultilingual(state),
});

// @ts-expect-error TS7006
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
    // @ts-expect-error TS7031
    withProps(({ field, parents = [] }) => ({
        parents: [field.name, ...parents],
    })),
    // @ts-expect-error TS2345
)(PropertyComponent);

export default Property;
