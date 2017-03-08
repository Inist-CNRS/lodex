import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RejectedIcon from 'material-ui/svg-icons/content/clear';
import ProposedIcon from 'material-ui/svg-icons/content/remove';
import ValidatedIcon from 'material-ui/svg-icons/action/done';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { red500, yellow500, green500, grey500 } from 'material-ui/styles/colors';

import propositionStatus from '../../../common/propositionStatus';
import { polyglot as polyglotPropTypes } from '../propTypes';

const icons = {
    PROPOSED: ProposedIcon,
    VALIDATED: ValidatedIcon,
    REJECTED: RejectedIcon,
};

const colors = {
    PROPOSED: yellow500,
    VALIDATED: green500,
    REJECTED: red500,
};

const getIcons = (status, active) => {
    const Icon = icons[status];

    return (
        <Icon color={active ? colors[status] : grey500} hoverColor={colors[status]} />
    );
};

export const ModerateButtonComponent = ({ status, changeStatus, p: polyglot }) => (
    <div className="moderate">
        {
            propositionStatus.map(availableStatus => (
                <IconButton
                    tooltip={polyglot.t(availableStatus)}
                    onClick={(e) => {
                        e.preventDefault();
                        changeStatus(status, availableStatus);
                        return false;
                    }}
                >
                    { getIcons(availableStatus, status === availableStatus) }
                </IconButton>
            ))
        }
    </div>
);

ModerateButtonComponent.propTypes = {
    status: PropTypes.oneOf(propositionStatus).isRequired,
    changeStatus: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
    connect(),
)(ModerateButtonComponent);
