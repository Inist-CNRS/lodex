// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { translate } from '../../../i18n/I18NContext';

import { getEditionComponent } from '../../index';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';
import InputList from './InputList';

// @ts-expect-error TS7006
const getSubFormat = (args) => ({
    args: args.subFormatOptions,
    name: args.subFormat,
});

class EditionComponent extends Component {
    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        // @ts-expect-error TS2339
        this.ItemComponent = getEditionComponent(
            getSubFormat(props.field.format.args),
        );
    }

    // @ts-expect-error TS7031
    renderList = ({ fields }) => {
        // @ts-expect-error TS2339
        const { p: polyglot, label } = this.props;
        const all = fields.getAll();

        return (
            <InputList
                // @ts-expect-error TS2769
                polyglot={polyglot}
                label={label}
                fields={fields}
                all={all}
                // @ts-expect-error TS2339
                ItemComponent={this.ItemComponent}
            />
        );
    };

    render() {
        // @ts-expect-error TS2339
        const { label, name } = this.props;

        return (
            <FieldArray
                name={name}
                component={this.renderList}
                // @ts-expect-error TS2769
                disabled={name === 'uri'}
                label={label}
                fullWidth
            />
        );
    }
}

// @ts-expect-error TS2339
EditionComponent.propTypes = {
    name: PropTypes.string.isRequired,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
};

// @ts-expect-error TS2339
EditionComponent.defaultProps = {
    className: null,
};

// @ts-expect-error TS2339
EditionComponent.isReduxFormReady = true;

export default translate(EditionComponent);
