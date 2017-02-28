import React, { PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';
import translate from 'redux-polyglot/translate';
import { CardHeader } from 'material-ui/Card';

import FormTextField from '../../lib/FormTextField';
import ComposedOfFieldList from './ComposedOfFieldList';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import AddComposedOf from './AddComposedOf';
import ClearComposedOf from './ClearComposedOf';

export const ComposedOfComponent = ({ name, value, p: polyglot }) => {
    if (!value) {
        return (
            <div>
                <CardHeader>
                    {polyglot.t('composed_of')}
                    <AddComposedOf />
                </CardHeader>
            </div>
        );
    }

    return (
        <div>
            <CardHeader>
                {polyglot.t('composed_of')}
                <ClearComposedOf />
            </CardHeader>
            <Field
                className="separator"
                name={`${name}.separator`}
                type="text"
                component={FormTextField}
                label={polyglot.t('separator')}
            />
            <FieldArray name={`${name}.fields`} component={ComposedOfFieldList} />
        </div>
    );
};

ComposedOfComponent.defaultProps = {
    value: null,
};

ComposedOfComponent.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({}),
    p: polyglotPropTypes.isRequired,
};

export default translate(ComposedOfComponent);
