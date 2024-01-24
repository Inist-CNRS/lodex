import React from 'react';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../../propTypes';
import { formatAdminStyle } from '../../adminStyles';

const DefaultAdmin = ({ p }) => {
    return (
        <fieldset style={formatAdminStyle.fieldset}>
            {p.t('format_without_params')}
        </fieldset>
    );
};

DefaultAdmin.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default translate(DefaultAdmin);
