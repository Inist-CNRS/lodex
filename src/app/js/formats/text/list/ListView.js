import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import stylesToClassname from '../../../lib/stylesToClassName';
import { field as fieldPropTypes } from '../../../propTypes';
import { getViewComponent } from '../../index';

const styles = (bullet) => stylesToClassname(
    {
        ordered: {
            listStyleType: 'decimal',
        },
        ordered_li: {},
        unordered: {
            listStyleType: bullet ? `"${bullet} "` : 'initial',
        },
        unordered_li: {},
        unordered_without_bullet: {
            listStyleType: 'none',
        },
        unordered_without_bullet_li: {},
        unordered_flat: {
            listStyleType: 'none',
        },
        unordered_flat_li: {
            display: 'inline',
            ':after': {
                content: `" ${bullet} "`,
            },
            ':last-child:after': {
                content: 'none',
            },
        },
    },
    'list-format',
);

export const UL = ({ className, children }) => (
    <ul className={className}>{children}</ul>
);

UL.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any.isRequired,
};

export const OL = ({ className, children }) => (
    <ol className={className}>{children}</ol>
);

OL.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any.isRequired,
};

const ListView = ({
    className,
    resource,
    field,
    type,
    bullet,
    subFormat,
    subFormatOptions,
}) => {
    const values = resource[field.name];
    if (values == null || values === '' || !Array.isArray(values)) {
        return null;
    }

    const { ViewComponent, args } = getViewComponent(subFormat);

    const List = type === 'ordered' ? OL : UL;

    const localStyles = styles(bullet);

    return (
        <List className={classnames(localStyles[type], className)}>
            {values.map((value, index) => (
                <li key={value} className={classnames(localStyles[`${type}_li`])}>
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
