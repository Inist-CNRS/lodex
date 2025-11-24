import { memo, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';

import { fromUser, fromFields } from '@lodex/frontend-common/sharedSelectors';
import { getViewComponent } from '@lodex/frontend-common/formats/getFormat';
import getColorSetFromField from '@lodex/frontend-common/utils/getColorSetFromField';
import { isEqual } from 'lodash';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { Box, Typography } from '@mui/material';
import InvalidFormat from '@lodex/frontend-common/formats/InvalidFormat';
import type { Field } from '@lodex/frontend-common/fields/types';
import { ErrorBoundary } from './ErrorBoundary';

interface FormatComponentProps {
    className?: string;
    field: Field;
    fieldStatus?: string | null;
    fields: unknown[];
    resource?: Record<string, unknown>;
    shrink?: boolean;
    isList?: boolean;
    filter?: string;
    facets?: object;
    colorSet?: string[];
    graphLink?: boolean;
}

export const FormatComponent = ({
    className,
    field,
    fieldStatus,
    fields,
    resource,
    shrink = false,
    isList = false,
    filter,
    facets,
    colorSet,
    graphLink,
}: FormatComponentProps) => {
    const { translate } = useTranslate();
    const isAdmin = useSelector(fromUser.isAdmin);
    const { ViewComponent, args } = useMemo(
        () => getViewComponent(field, isList),
        [field, isList],
    );

    return (
        <ErrorBoundary
            fallback={
                <Box>
                    {isAdmin ? (
                        <InvalidFormat
                            format={field.format}
                            value={resource?.[field.name]}
                        />
                    ) : (
                        <Typography>{translate('bad_format_error')}</Typography>
                    )}
                </Box>
            }
        >
            <ViewComponent
                className={className}
                field={field}
                fieldStatus={fieldStatus}
                fields={fields}
                resource={resource}
                shrink={shrink}
                filter={filter}
                facets={facets}
                colorSet={colorSet}
                graphLink={graphLink}
                {...args}
            />
        </ErrorBoundary>
    );
};

// Memoize component to replace shouldComponentUpdate optimization
const MemoizedFormatComponent = memo(
    FormatComponent,
    (prevProps, nextProps) => {
        return isEqual(prevProps, nextProps);
    },
);

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    fields: [
        ...fromFields.getCollectionFields(state),
        ...fromFields.getDatasetFields(state),
        ...fromFields.getGraphicFields(state),
    ],
    token: fromUser.getToken(state),
    colorSet: getColorSetFromField(field),
});

export default connect(mapStateToProps)(MemoizedFormatComponent);
