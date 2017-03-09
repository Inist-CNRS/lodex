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

import { isLoggedIn } from '../user';

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

const styles = {
    iconButton: {
        padding: 0,
        height: null,
    },
};

export const ModerateButtonComponent = ({ status, changeStatus, loggedIn, p: polyglot }) => {
    if (!loggedIn || !status) {
        return null;
    }
    return (
        <div className="moderate">
            {
                propositionStatus.map(availableStatus => (
                    <IconButton
                        style={styles.iconButton}
                        key={availableStatus}
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
};

ModerateButtonComponent.defaultProps = {
    status: null,
};

ModerateButtonComponent.propTypes = {
    status: PropTypes.oneOf(propositionStatus),
    changeStatus: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    loggedIn: isLoggedIn(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(ModerateButtonComponent);
