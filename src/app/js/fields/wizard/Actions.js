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
                    variant="contained"
                    className="btn-save"
                    label={polyglot.t('save')}
                    color="secondary"
                    onClick={onSave}
                />
                <Button
                    variant="text"
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
                <Button
                    variant="text"
                    className="btn-next"
                    label={polyglot.t('next')}
                    onClick={onNextStep}
                />
                <Button
                    variant="contained"
                    className="btn-save"
                    label={polyglot.t('save')}
                    color="primary"
                    onClick={onSave}
                />
                <Button
                    variant="text"
                    className="btn-exit-column-edition"
                    label={polyglot.t('cancel')}
                    color="secondary"
                    onClick={onCancel}
                />
            </div>
        );
    }

    if (step === stepsCount - 1) {
        return (
            <div>
                <Button
                    variant="text"
                    className="btn-previous"
                    label={polyglot.t('previous')}
                    onClick={onPreviousStep}
                />
                <Button
                    variant="contained"
                    className="btn-save"
                    label={polyglot.t('save')}
                    onClick={onSave}
                    color="primary"
                />
                <Button
                    variant="text"
                    className="btn-exit-column-edition"
                    color="secondary"
                    label={polyglot.t('cancel')}
                    onClick={onCancel}
                />
            </div>
        );
    }

    return (
        <div>
            <Button
                variant="text"
                className="btn-previous"
                label={polyglot.t('previous')}
                onClick={onPreviousStep}
            />
            <Button
                variant="text"
                className="btn-next"
                label={polyglot.t('next')}
                onClick={onNextStep}
            />
            <Button
                variant="contained"
                className="btn-save"
                label={polyglot.t('save')}
                color="primary"
                onClick={onSave}
            />
            <Button
                variant="text"
                className="btn-exit-column-edition"
                label={polyglot.t('cancel')}
                color="secondary"
                onClick={onCancel}
            />
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
