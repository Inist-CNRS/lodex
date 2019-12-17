import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from '@material-ui/core/MenuItem';
import upperFirst from 'lodash.upperfirst';

import * as overview from '../../../common/overview';
import { polyglot as polyglotPropTypes } from '../propTypes';
import FormSelectField from '../lib/components/FormSelectField';

export const OverviewFieldComponent = ({ p: polyglot }) => {
    const overviewItems = [
        {
            _id: overview.NONE,
            value: 'none',
        },
        {
            _id: overview.RESOURCE_TITLE,
            value: 'title',
        },
        {
            _id: overview.RESOURCE_DESCRIPTION,
            value: 'description',
        },
        {
            _id: overview.RESOURCE_DETAIL_1,
            value: 'detail1',
        },
        {
            _id: overview.RESOURCE_DETAIL_2,
            value: 'detail2',
        },
        {
            _id: overview.DATASET_TITLE,
            value: 'datasetTitle',
        },
        {
            _id: overview.DATASET_DESCRIPTION,
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
