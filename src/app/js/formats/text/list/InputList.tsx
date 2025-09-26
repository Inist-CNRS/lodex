// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { IconButton, Button } from '@mui/material';
import ActionDeleteIcon from '@mui/icons-material/Delete';
import ActionAddIcon from '@mui/icons-material/Add';
import classnames from 'classnames';
import memoize from 'lodash/memoize';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import stylesToClassname from '../../../lib/stylesToClassName';

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

class InputList extends Component {
    convertToList = () => {
        // @ts-expect-error TS2339
        const { fields, all } = this.props;
        fields.removeAll();
        all.split(';').forEach(fields.push);
    };

    // @ts-expect-error TS7006
    removeValue = memoize((index) => () => this.props.fields.remove(index));

    // @ts-expect-error TS2339
    addValue = () => this.props.fields.push();
    render() {
        // @ts-expect-error TS2339
        const { fields, polyglot, label, all, ItemComponent } = this.props;

        if (typeof all === 'string') {
            return (
                <div>
                    <p>{polyglot.t('bad_format_edit_list')}</p>
                    <Button
                        variant="contained"
                        className="convert-to-list"
                        color="primary"
                        onClick={this.convertToList}
                    >
                        {polyglot.t('convert_to_list')}
                    </Button>
                </div>
            );
        }

        return (
            // @ts-expect-error TS2339
            <div className={styles.list}>
                <label>{label}</label>
                {fields.length === 0 && <p>{polyglot.t('empty')}</p>}
                {/*
                 // @ts-expect-error TS7006 */}
                {fields.map((name, index) => (
                    // @ts-expect-error TS2339
                    <div key={name} className={styles.item}>
                        <Field
                            {...this.props}
                            // @ts-expect-error TS2339
                            className={styles.input}
                            name={name}
                            component={ItemComponent}
                            resource={{ [name]: all[index] }}
                            field={{ name }}
                        />

                        {/*
                         // @ts-expect-error TS2769 */}
                        <IconButton
                            className="remove"
                            tooltip={polyglot.t('remove')}
                            onClick={this.removeValue(index)}
                        >
                            <ActionDeleteIcon />
                        </IconButton>
                    </div>
                ))}
                {/*
                 // @ts-expect-error TS2769 */}
                <IconButton
                    // @ts-expect-error TS2339
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

// @ts-expect-error TS2339
InputList.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
    label: PropTypes.string.isRequired,
    all: PropTypes.oneOf([PropTypes.array, PropTypes.string]).isRequired,
    fields: PropTypes.array,
    ItemComponent: PropTypes.object.isRequired,
};

export default InputList;
