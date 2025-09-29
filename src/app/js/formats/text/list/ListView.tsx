import classnames from 'classnames';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';

import stylesToClassname from '../../../lib/stylesToClassName';
import { field as fieldPropTypes } from '../../../propTypes';
import { getViewComponent } from '../../index';

// @ts-expect-error TS7006
const styles = (bullet) =>
    stylesToClassname(
        {
            ordered: {
                listStyleType: 'decimal',
                marginLeft: '6px',
                marginBottom: '12px',
            },
            ordered_li: {
                marginBottom: '12px',
            },
            unordered: {
                listStyleType: bullet ? `"${bullet} "` : 'initial',
                marginBottom: '12px',
            },
            unordered_li: {
                marginBottom: '12px',
            },
            unordered_without_bullet: {
                listStyleType: 'none',
                marginBottom: '12px',
            },
            unordered_without_bullet_li: {
                marginBottom: '12px',
            },
            unordered_flat: {
                listStyleType: 'none',
            },
            unordered_flat_li: {
                display: 'inline-block',
                marginRight: '12px',
                ':after': {
                    content: bullet ? `" ${bullet} "` : '""',
                },
                ':last-child:after': {
                    content: '""',
                },
                ':last-child': {
                    marginRight: '0',
                },
            },
        },
        'list-format',
    );

// @ts-expect-error TS7031
export const UL = ({ className, children }) => (
    <ul className={className}>{children}</ul>
);

UL.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any.isRequired,
};

// @ts-expect-error TS7031
export const OL = ({ className, children }) => (
    <ol className={className}>{children}</ol>
);

OL.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any.isRequired,
};

const ListView = ({
    // @ts-expect-error TS7031
    className,
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    type,
    // @ts-expect-error TS7031
    bullet,
    // @ts-expect-error TS7031
    subFormat,
    // @ts-expect-error TS7031
    subFormatOptions,
}) => {
    const values = resource[field.name];
    if (values == null || values === '' || !Array.isArray(values)) {
        return null;
    }

    // @ts-expect-error TS2554
    const { ViewComponent, args } = getViewComponent(subFormat);

    const List = type === 'ordered' ? OL : UL;

    const localStyles = styles(bullet);

    return (
        // @ts-expect-error TS7053
        <List className={classnames(localStyles[type], className)}>
            {values.map((value, index) => (
                <li
                    key={value}
                    // @ts-expect-error TS7053
                    className={classnames(localStyles[`${type}_li`])}
                >
                    {subFormat ? (
                        <ViewComponent
                            resource={values}
                            field={{
                                ...field,
                                name: index.toString(),
                                valueOfList: value,
                                format: {
                                    name: subFormat,
                                    args: subFormatOptions,
                                },
                            }}
                            {...args}
                            {...subFormatOptions}
                        />
                    ) : (
                        value
                    )}
                </li>
            ))}
        </List>
    );
};

ListView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    type: PropTypes.string,
    bullet: PropTypes.string,
    subFormat: PropTypes.string,
    subFormatOptions: PropTypes.any,
};

ListView.defaultProps = {
    className: null,
};

export default ListView;
