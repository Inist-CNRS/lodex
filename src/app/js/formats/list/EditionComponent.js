import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, Field } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import ActionAddIcon from 'material-ui/svg-icons/content/add';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite/no-important';

import { getEditionComponent } from '../';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

const styles = StyleSheet.create({
    item: {
        display: 'flex',
    },
    input: {
        flex: 'auto',
    },
    add: {
        float: 'right',
    },
});

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
        const { p: polyglot } = this.props;
        return (
            <div>
                {fields.map((value, index) => (
                    <div key={value} className={css(styles.item)}>
                        <Field
                            className={css(styles.input)}
                            name={value}
                            fullwidth
                            component={this.ItemComponent}
                        />

                        <IconButton
                            tooltip={polyglot.t('remove')}
                            onClick={() => fields.remove(index)}
                        >
                            <ActionDeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <IconButton
                    className={css(styles.add)}
                    tooltip={polyglot.t('add')}
                    onClick={() => fields.push()}
                >
                    <ActionAddIcon />
                </IconButton>
            </div>
        );
    };

    render() {
        const { label, input } = this.props;

        return (
            <FieldArray
                name={input.name}
                component={this.renderList}
                disabled={name === 'uri'}
                label={label}
                fullWidth
            />
        );
    }
}

EditionComponent.propTypes = {
    input: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
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
