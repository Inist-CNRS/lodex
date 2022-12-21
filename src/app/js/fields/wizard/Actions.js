import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

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

export const ActionsComponent = ({
    field,
    step,
    stepsCount,
    p: polyglot,
    onPreviousStep,
    onNextStep,
    onCancel,
    onSave,
}) => {
    if (!field) return null;

    if (field.name === 'uri') {
        return (
            <div>
                <Button
                    variant="contained"
                    className="btn-save"
                    color="secondary"
                    onClick={onSave}
                >
                    {polyglot.t('save')}
                </Button>
                <Button
                    variant="text"
                    className="btn-exit-column-edition"
                    onClick={onCancel}
                >
                    {polyglot.t('cancel')}
                </Button>
            </div>
        );
    }

    if (step === 0) {
        return (
            <div style={styles.root}>
                <div>
                    <RemoveButton field={field} />
                </div>
                <div>
                    <Button
                        variant="text"
                        className="btn-next"
                        onClick={onNextStep}
                    >
                        {polyglot.t('next')}
                    </Button>
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
    }

    if (step === stepsCount - 1) {
        return (
            <div style={styles.root}>
                <div>
                    <RemoveButton field={field} />
                </div>
                <div>
                    <Button
                        variant="text"
                        className="btn-previous"
                        onClick={onPreviousStep}
                    >
                        {polyglot.t('previous')}
                    </Button>
                    <Button
                        variant="contained"
                        className="btn-save"
                        onClick={onSave}
                        color="primary"
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
    }

    return (
        <div style={styles.root}>
            <div>
                <RemoveButton field={field} />
            </div>
            <div>
                <Button
                    variant="text"
                    className="btn-previous"
                    onClick={onPreviousStep}
                >
                    {polyglot.t('previous')}
                </Button>
                <Button
                    variant="text"
                    className="btn-next"
                    onClick={onNextStep}
                >
                    {polyglot.t('next')}
                </Button>
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
    step: PropTypes.number.isRequired,
    stepsCount: PropTypes.number.isRequired,
    onPreviousStep: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

ActionsComponent.defaultProps = {
    field: null,
};

export default translate(ActionsComponent);
