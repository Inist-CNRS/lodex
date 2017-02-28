import React, { PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';
import translate from 'redux-polyglot/translate';
import Subheader from 'material-ui/Subheader';

import FormTextField from '../../lib/FormTextField';
import ComposedOfFieldList from './ComposedOfFieldList';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import AddComposedOf from './AddComposedOf';
import ClearComposedOf from './ClearComposedOf';

const styles = {
    header: {
        fontSize: '16px',
        paddingLeft: 0,
    },
};

export const ComposedOfComponent = ({ name, value, p: polyglot }) => {
    if (!value) {
        return (
            <div>
                <Subheader style={styles.header}>
                    {polyglot.t('composed_of')}
                    <AddComposedOf />
                </Subheader>
            </div>
        );
    }

    return (
        <div>
            <Subheader>
                {polyglot.t('composed_of')}
                <ClearComposedOf />
            </Subheader>
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
