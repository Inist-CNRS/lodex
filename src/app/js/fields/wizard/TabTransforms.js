import React from 'react';
import { FieldArray, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/dist/translate';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { memoize } from 'lodash';

import TransformerList from '../TransformerList';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { isSubresourceTransformation } from './TabValueSubresource';
import { FIELD_FORM_NAME } from '..';
// eslint-disable-next-line import/namespace, import/no-named-as-default, import/no-named-as-default-member, import/default
import TransformerList2 from '../TransformerList2';

export const renderTransformerFunction = (
    locked,
    isSubresourceField,
    polyglot,
) => {
    function RenderTransformer(props) {
        if (locked) {
            return (
                <span>
                    {polyglot.t(
                        'transformer_no_editable_with_subresource_uid_value',
                    )}
                </span>
            );
        }

        return (
            <>
                <TransformerList
                    hideFirstTransformers={isSubresourceField ? 3 : 0}
                    {...props}
                />
                <TransformerList2
                    hideFirstTransformers={isSubresourceField ? 3 : 0}
                    {...props}
                />
            </>
        );
    }

    return RenderTransformer;
};

const renderTransformer = memoize(renderTransformerFunction);

export const TabTransformComponent = ({
    isSubresourceField,
    p: polyglot,
    locked,
}) => (
    <>
        <FieldArray
            name="transformers"
            component={renderTransformer(locked, isSubresourceField, polyglot)}
            type="transform"
            rerenderOnEveryChange
        />
    </>
);

TabTransformComponent.propTypes = {
    isSubresourceField: PropTypes.bool,
    locked: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => {
    const transformers = formValueSelector(FIELD_FORM_NAME)(
        state,
        'transformers',
    );

    return {
        locked: isSubresourceTransformation(transformers || []),
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(TabTransformComponent);
