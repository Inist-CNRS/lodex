import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
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
                    label={polyglot.t('save')}
                    variant="contained"
                    secondary
                    onClick={onSave}
                />
                <Button
                    className="btn-exit-column-edition"
                    label={polyglot.t('cancel')}
                    onClick={onCancel}
                />
            </div>
        );
    }

    if (step === 0) {
        return (
            <div>
                <Button className="btn-next" onClick={onNextStep}>
                    {polyglot.t('next')}
                </Button>
                <Button className="btn-save" primary onClick={onSave}>
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

                <Button className="btn-save" onClick={onSave} primary>
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

    return (
        <div>
            <Button className="btn-previous" onClick={onPreviousStep}>
                {polyglot.t('previous')}
            </Button>

            <Button className="btn-next" onClick={onNextStep}>
                {polyglot.t('next')}
            </Button>
            <Button className="btn-save" primary onClick={onSave}>
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
