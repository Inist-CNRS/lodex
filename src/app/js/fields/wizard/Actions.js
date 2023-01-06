import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { useParams } from 'react-router';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import RemoveButton from '../../admin/preview/RemoveButton';

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
};

export const ActionsComponent = ({ field, p: polyglot, onCancel, onSave }) => {
    const { filter } = useParams();
    if (!field) return null;

    return (
        <div style={styles.root}>
            {field.name !== 'uri' && (
                <div>
                    <RemoveButton field={field} filter={filter} />
                </div>
            )}
            <div>
                <Button
                    variant="contained"
                    className="btn-save"
                    color="primary"
                    onClick={onSave}
                >
                    {polyglot.t('save')}
                </Button>
                <Button
                    variant="text"
                    className="btn-exit-column-edition"
                    color="secondary"
                    onClick={onCancel}
                >
                    {polyglot.t('cancel')}
                </Button>
            </div>
        </div>
    );
};

ActionsComponent.propTypes = {
    field: fieldPropTypes,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ActionsComponent.defaultProps = {
    field: null,
};

export default translate(ActionsComponent);
