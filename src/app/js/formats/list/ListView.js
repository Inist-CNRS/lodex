import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { field as fieldPropTypes } from '../../propTypes';
import { getViewComponent } from '../';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        ordered: {
            listStyleType: 'decimal',
        },
        unordered: {
            listStyleType: 'initial',
        },
        unordered_without_bullet: {
            listStyleType: 'none',
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
    subFormat,
    subFormatOptions,
}) => {
    let values = resource[field.name];
    const { ViewComponent, args } = getViewComponent(subFormat);

    const List = type === 'ordered' ? OL : UL;

    return (
        <List className={classnames(styles[type], className)}>
            {values.map((value, index) => (
                <li key={value}>
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
    subFormat: PropTypes.string,
    subFormatOptions: PropTypes.any,
};

ListView.defaultProps = {
    className: null,
};

export default ListView;
