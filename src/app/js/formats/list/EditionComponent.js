import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import translate from 'redux-polyglot/translate';

import { getEditionComponent } from '../';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import InputList from './InputList';

const getSubFormat = args => ({
    args: args.subFormatOptions,
    name: args.subFormat,
});

class EditionComponent extends Component {
    constructor(props) {
        super(props);
        this.ItemComponent = getEditionComponent(
            getSubFormat(props.field.format.args),
        );
    }

    renderList = ({ fields }) => {
        const { p: polyglot, label } = this.props;
        const all = fields.getAll();

        return (
            <InputList
                polyglot={polyglot}
                label={label}
                fields={fields}
                all={all}
                ItemComponent={this.ItemComponent}
            />
        );
    };

    render() {
        const { label, name } = this.props;

        return (
            <FieldArray
                name={name}
                component={this.renderList}
                disabled={name === 'uri'}
                label={label}
                fullWidth
            />
        );
    }
}

EditionComponent.propTypes = {
    name: PropTypes.string.isRequired,
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
};

EditionComponent.defaultProps = {
    className: null,
};

EditionComponent.isReduxFormReady = true;

export default translate(EditionComponent);
