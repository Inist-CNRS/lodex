import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import memoize from 'lodash.memoize';
import { Field } from 'redux-form';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

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
                    <Button
                        className="convert-to-list"
                        label={polyglot.t('convert_to_list')}
                        variant="contained"
                        onClick={this.convertToList}
                        primary
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
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </div>
                ))}
                <IconButton
                    className={classnames(styles.add, 'add')}
                    tooltip={polyglot.t('add')}
                    onClick={this.addValue}
                >
                    <FontAwesomeIcon icon={faPlus} />
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
