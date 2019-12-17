import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from '@material-ui/core/FlatButton';
import RaisedButton from '@material-ui/core/RaisedButton';
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
                <RaisedButton
                    className="btn-save"
                    label={polyglot.t('save')}
                    secondary
                    onClick={onSave}
                />
                <FlatButton
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
                <FlatButton
                    className="btn-next"
                    label={polyglot.t('next')}
                    onClick={onNextStep}
                />
                <RaisedButton
                    className="btn-save"
                    label={polyglot.t('save')}
                    primary
                    onClick={onSave}
                />
                <FlatButton
                    className="btn-exit-column-edition"
                    label={polyglot.t('cancel')}
                    secondary
                    onClick={onCancel}
                />
            </div>
        );
    }

    if (step === stepsCount - 1) {
        return (
            <div>
                <FlatButton
                    className="btn-previous"
                    label={polyglot.t('previous')}
                    onClick={onPreviousStep}
                />
                <RaisedButton
                    className="btn-save"
                    label={polyglot.t('save')}
                    onClick={onSave}
                    primary
                />
                <FlatButton
                    className="btn-exit-column-edition"
                    secondary
                    label={polyglot.t('cancel')}
                    onClick={onCancel}
                />
            </div>
        );
    }

    return (
        <div>
            <FlatButton
                className="btn-previous"
                label={polyglot.t('previous')}
                onClick={onPreviousStep}
            />
            <FlatButton
                className="btn-next"
                label={polyglot.t('next')}
                onClick={onNextStep}
            />
            <RaisedButton
                className="btn-save"
                label={polyglot.t('save')}
                primary
                onClick={onSave}
            />
            <FlatButton
                className="btn-exit-column-edition"
                label={polyglot.t('cancel')}
                secondary
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
