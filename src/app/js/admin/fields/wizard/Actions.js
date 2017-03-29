import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';

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
                <FlatButton
                    className="btn-exit-column-edition"
                    label={polyglot.t('cancel')}
                    onTouchTap={onCancel}
                />
                <FlatButton
                    className="btn-save"
                    label={polyglot.t('save')}
                    secondary
                    onTouchTap={onSave}
                />
            </div>
        );
    }

    if (step === 0) {
        return (
            <div>
                <FlatButton
                    className="btn-exit-column-edition"
                    label={polyglot.t('cancel')}
                    onTouchTap={onCancel}
                />
                <FlatButton
                    className="btn-next"
                    label={polyglot.t('next')}
                    primary
                    onTouchTap={onNextStep}
                />
                <FlatButton
                    className="btn-save"
                    label={polyglot.t('save')}
                    secondary
                    onTouchTap={onSave}
                />
            </div>
        );
    }

    if (step === stepsCount - 1) {
        return (
            <div>
                <FlatButton
                    className="btn-exit-column-edition"
                    label={polyglot.t('cancel')}
                    onTouchTap={onCancel}
                />
                <FlatButton
                    className="btn-previous"
                    label={polyglot.t('previous')}
                    onTouchTap={onPreviousStep}
                    primary
                />
                <FlatButton
                    className="btn-save"
                    label={polyglot.t('save')}
                    secondary
                    onTouchTap={onSave}
                />
            </div>
        );
    }

    return (
        <div>
            <FlatButton
                className="btn-exit-column-edition"
                label={polyglot.t('cancel')}
                onTouchTap={onCancel}
            />
            <FlatButton
                className="btn-previous"
                label={polyglot.t('previous')}
                primary
                onTouchTap={onPreviousStep}
            />
            <FlatButton
                className="btn-next"
                label={polyglot.t('next')}
                primary
                onTouchTap={onNextStep}
            />
            <FlatButton
                className="btn-save"
                label={polyglot.t('save')}
                secondary
                onTouchTap={onSave}
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
