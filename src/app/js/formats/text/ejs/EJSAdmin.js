import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import translate from 'redux-polyglot/translate';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import React from 'react';
import { Box } from '@mui/material';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import updateAdminArgs from '../../utils/updateAdminArgs';
import EJSEditor from './EJSEditor';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    template: ``,
};

const EJSAdmin = (props) => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const { params, template } = args;

    const handleParams = (newParams) => {
        updateAdminArgs('params', newParams, props);
    };

    const handleTemplateChange = (newTemplate) => {
        updateAdminArgs('template', newTemplate, props);
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
        >
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet>
                <EJSEditor value={template} onChange={handleTemplateChange} />
            </FormatDefaultParamsFieldSet>
        </Box>
    );
};

EJSAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        template: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

EJSAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(EJSAdmin);
