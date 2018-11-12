import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import { getViewComponent } from '../';
import InvalidFormat from '../InvalidFormat';

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
    values = typeof values === 'string' ? [values] : values;
    const { ViewComponent, args } = getViewComponent(subFormat);

    const List = type === 'ordered' ? OL : UL;

    const noValue = !values;
    const invalidValue = !Array.isArray(values);
    const emptyValue =
        values &&
        (values.length < 1 || (values.length === 1 && !values[0].trim()));

    if (noValue || invalidValue || emptyValue) {
        return <InvalidFormat format={field.format} value={values} />;
    }

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
