import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';

import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';

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
                    className="btn-save"
                    secondary
                    variant="contained"
                    onClick={onSave}
                >
                    {polyglot.t('save')}
                </Button>
                <Button className="btn-exit-column-edition" onClick={onCancel}>
                    {polyglot.t('cancel')}
                </Button>
            </div>
        );
    }

    if (step === 0) {
        return (
            <div>
                <Button className="btn-next" onClick={onNextStep}>
                    {polyglot.t('next')}
                </Button>
                <Button
                    className="btn-save"
                    primary
                    variant="contained"
                    onClick={onSave}
                >
                    {polyglot.t('save')}
                </Button>
                <Button
                    className="btn-exit-column-edition"
                    secondary
                    onClick={onCancel}
                >
                    {polyglot.t('cancel')}
                </Button>
            </div>
        );
    }

    if (step === stepsCount - 1) {
        return (
            <div>
                <Button className="btn-previous" onClick={onPreviousStep}>
                    {polyglot.t('previous')}
                </Button>
                <Button
                    className="btn-save"
                    onClick={onSave}
                    color="primary"
                    variant="contained"
                >
                    {polyglot.t('save')}
                </Button>
                <Button
                    className="btn-exit-column-edition"
                    color="secondary"
                    onClick={onCancel}
                >
                    {polyglot.t('cancel')}
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Button className="btn-previous" onClick={onPreviousStep}>
                {polyglot.t('previous')}
            </Button>
            <Button className="btn-next" onClick={onNextStep}>
                {polyglot.t('next')}
            </Button>
            <Button
                className="btn-save"
                primary
                variant="contained"
                onClick={onSave}
            >
                {polyglot.t('save')}
            </Button>
            <Button
                className="btn-exit-column-edition"
                secondary
                onClick={onCancel}
            >
                {polyglot.t('cancel')}
            </Button>
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
