import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { MenuItem } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../propTypes';
import { hasSimilarScope } from '../../../common/scope';
import FieldInternalIcon from './FieldInternalIcon';

const styles = {
    complete: {
        paddingLeft: '40px',
    },
    header: {
        lineHeight: '48px',
        paddingLeft: 0,
    },
    line: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    internal: {
        display: 'flex',
        alignItems: 'center',
    },
};

const FieldAnnotation = ({ fields, scope, p: polyglot }) => (
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
            <MenuItem value={null}>
                {polyglot.t('completes_field_none')}
            </MenuItem>
            {fields.filter(hasSimilarScope(scope)).map(f => (
                <MenuItem
                    className={`completes-${getFieldClassName(f)}`}
                    key={f.name}
                    value={f.name}
                    style={styles.line}
                >
                    <div>{f.label}</div>
                    <div style={styles.internal}>
                        <FieldInternalIcon scope={f.internalScope} />
                        {f.internalName}
                    </div>
                </MenuItem>
            ))}
        </Field>
    </div>
);

FieldAnnotation.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    scope: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldAnnotation);
