import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import upperFirst from 'lodash.upperfirst';

import { polyglot as polyglotPropTypes } from '../propTypes';
import FormSelectField from '../lib/components/FormSelectField';

export const OverviewFieldComponent = ({ p: polyglot }) => {
    const overviewItems = [
        {
            _id: 0,
            value: 'none',
        },
        {
            _id: 1,
            value: 'title',
        },
        {
            _id: 2,
            value: 'description',
        },
        {
            _id: 100,
            value: 'datasetTitle',
        },
        {
            _id: 200,
            value: 'datasetDescription',
        },
    ];
    const overviewMenuItems = overviewItems.map(({ _id, value }) => (
        <MenuItem
            className={value}
            key={value}
            value={_id}
            primaryText={polyglot.t(`overview${upperFirst(value)}`)}
        />
    ));

    return (
        <Field
            name="overview"
            component={FormSelectField}
            label={polyglot.t('overview')}
            className="field-overview"
            fullWidth
        >
            {overviewMenuItems}
        </Field>
    );
};

OverviewFieldComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(OverviewFieldComponent);
