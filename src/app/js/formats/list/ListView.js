import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
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
    p: polyglot,
}) => {
    const values = resource[field.name];
    const { ViewComponent, args } = getViewComponent(subFormat, true);

    const List = type === 'ordered' ? OL : UL;

    if (values.length < 1 || (values.length == 1 && !values[0].trim())) {
        return <p>{polyglot.t('error')}</p>;
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
    p: polyglotPropTypes.isRequired,
};

ListView.defaultProps = {
    className: null,
};

export default compose(translate)(ListView);
