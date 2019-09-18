import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import ActionDeleteIcon from '@material-ui/icons/Delete';
import ActionAddIcon from '@material-ui/icons/Add';
import RaisedButton from 'material-ui/RaisedButton';
import classnames from 'classnames';
import memoize from 'lodash.memoize';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        item: {
            display: 'flex',
            padding: 10,
        },
        input: {
            flex: 'auto',
        },
        add: {
            float: 'right',
        },
        list: {
            marginTop: 14,
        },
    },
    'input-list',
);

const underlineStyle = { position: 'relative' };

class InputList extends Component {
    convertToList = () => {
        const { fields, all } = this.props;
        fields.removeAll();
        all.split(';').forEach(fields.push);
    };

    removeValue = memoize(index => () => this.props.fields.remove(index));

    addValue = () => this.props.fields.push();
    render() {
        const { fields, polyglot, label, all, ItemComponent } = this.props;

        if (typeof all === 'string') {
            return (
                <div>
                    <p>{polyglot.t('bad_format_edit_list')}</p>
                    <RaisedButton
                        className="convert-to-list"
                        primary
                        onClick={this.convertToList}
                        label={polyglot.t('convert_to_list')}
                    />
                </div>
            );
        }

        return (
            <div className={styles.list}>
                <label>{label}</label>
                {fields.length === 0 && <p>{polyglot.t('empty')}</p>}
                {fields.map((name, index) => (
                    <div key={name} className={styles.item}>
                        <Field
                            {...this.props}
                            className={styles.input}
                            underlineStyle={underlineStyle}
                            name={name}
                            component={ItemComponent}
                            resource={{ [name]: all[index] }}
                            field={{ name }}
                        />

                        <IconButton
                            className="remove"
                            tooltip={polyglot.t('remove')}
                            onClick={this.removeValue(index)}
                        >
                            <ActionDeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <IconButton
                    className={classnames(styles.add, 'add')}
                    tooltip={polyglot.t('add')}
                    onClick={this.addValue}
                >
                    <ActionAddIcon />
                </IconButton>
            </div>
        );
    }
}

InputList.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    label: PropTypes.string.isRequired,
    all: PropTypes.oneOf([PropTypes.array, PropTypes.string]).isRequired,
    fields: PropTypes.array,
    ItemComponent: PropTypes.object.isRequired,
};

export default InputList;
