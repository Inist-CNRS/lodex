import React, { useMemo } from 'react';
import { connect } from 'react-redux';

import { fromUser, fromFields } from '../sharedSelectors';
import { getViewComponent } from '../formats';
import getColorSetFromField from '../lib/getColorSetFromField';
import { isEqual } from 'lodash';

interface FormatComponentProps {
    className?: string;
    field: unknown;
    fieldStatus?: string | null;
    fields: unknown[];
    resource?: object;
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
    const { ViewComponent, args } = useMemo(
        () => getViewComponent(field, isList),
        [field, isList],
    );

    return (
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
    );
};

// Memoize component to replace shouldComponentUpdate optimization
const MemoizedFormatComponent = React.memo(
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
