import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import { getViewComponent } from '../';

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
    const values = resource[field.name];
    const { ViewComponent, args } = getViewComponent(subFormat, true);

    const List = type === 'ordered' ? OL : UL;

    return (
        <List className={className}>
            {values.map((value, index) => (
                <li key={value}>
                    {subFormat ? (
                        <ViewComponent
                            resource={values}
                            field={{
                                ...field,
                                name: index.toString(),
                                format: {
                                    name: subFormat,
                                    args: subFormatOptions,
                                },
                            }}
                            {...args}
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
