import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import translate from 'redux-polyglot/translate';

import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';

const styles = {
    complete: {
        paddingLeft: '40px',
    },
    header: {
        lineHeight: '48px',
        paddingLeft: 0,
    },
};

const FieldAnnotation = ({ fields, p: polyglot }) => (
    <div>
        <div style={styles.header}>{polyglot.t('annotate_field')}</div>
        <Field
            style={styles.complete}
            className="completes"
            name="completes"
            component={FormSelectField}
            hint={polyglot.t('select_a_column')}
            fullWidth
        >
            <MenuItem
                value={null}
                primaryText={polyglot.t('completes_field_none')}
            />
            {fields.map(f => (
                <MenuItem
                    className={`completes-${getFieldClassName(f)}`}
                    key={f.name}
                    value={f.name}
                    primaryText={f.label}
                />
            ))}
        </Field>
    </div>
);

FieldAnnotation.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldAnnotation);
