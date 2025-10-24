import { grey } from '@mui/material/colors';
import classnames from 'classnames';
import get from 'lodash/get';
import memoize from 'lodash/memoize';

import { useDispatch, useSelector } from 'react-redux';

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
import { changeFieldStatus as changeFieldStatusAction } from '../resource';
import { fromDisplayConfig, fromResource } from '../selectors';
import CompositeProperty from './CompositeProperty';
import ModerateButton from './ModerateButton';
import PropertyContributor from './PropertyContributor';
import PropertyLinkedFields from './PropertyLinkedFields';

import { REJECTED } from '../../../../common/propositionStatus';

import { Settings } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { extractTenantFromUrl } from '../../../../common/tools/tenantTools';
import { CreateAnnotationButton } from '../../annotation/CreateAnnotationButton';
import { useCanAnnotate } from '../../annotation/useCanAnnotate';
import { useMemo } from 'react';
import type { State } from '../../admin/reducers';

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
    isSub?: boolean;
    resource: Record<string, unknown>;
    parents: string[];
    style?: object;
}

export const PropertyComponent = ({
    className,
    field,
    isSub,
    resource,
    style,
    parents = [],
}: PropertyComponentProps) => {
    const canAnnotate = useCanAnnotate();
    const isAdmin = useSelector(fromUser.isAdmin);
    const fieldStatus = useSelector((state: State) =>
        fromResource.getFieldStatus(state, field),
    );
    const predicate = useMemo(
        () => getPredicate(field) ?? (() => true),
        [field],
    );
    const dense = useSelector(fromDisplayConfig.isDense);
    const isMultilingual = useSelector(fromDisplayConfig.isMultilingual);
    const formatParents = useMemo(
        () => [field.name, ...parents],
        [field.name, parents],
    );

    const dispatch = useDispatch();

    const changeStatus = (payload: any) =>
        dispatch(changeFieldStatusAction(payload));

    if (
        !shouldDisplayField(
            resource,
            field,
            fieldStatus,
            // @ts-expect-error TS7006
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
        <CompositeProperty
            key="composite"
            field={field}
            resource={resource}
            parents={formatParents}
        />,
        <PropertyLinkedFields
            key="linked-fields"
            fieldName={field.name}
            // @ts-expect-error TS2322
            resource={resource}
            parents={formatParents}
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

export default PropertyComponent;
