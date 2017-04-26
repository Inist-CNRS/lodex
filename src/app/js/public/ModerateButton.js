import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RejectedIcon from 'material-ui/svg-icons/content/clear';
import ProposedIcon from 'material-ui/svg-icons/content/remove';
import ValidatedIcon from 'material-ui/svg-icons/action/done';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { red500, yellow500, green500, grey500 } from 'material-ui/styles/colors';
import classnames from 'classnames';

import propositionStatus from '../../../common/propositionStatus';
import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromResource } from './selectors';
import { fromUser } from '../sharedSelectors';

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

export const ModerateButtonComponent = ({ contributor, status, changeStatus, loggedIn, p: polyglot }) => {
    if (!loggedIn || !status || !contributor) {
        return null;
    }
    return (
        <div className="moderate">
            {
                propositionStatus.map(availableStatus => (
                    <IconButton
                        className={classnames(availableStatus, { active: availableStatus === status })}
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
    contributor: null,
    status: null,
};

ModerateButtonComponent.propTypes = {
    contributor: PropTypes.string,
    status: PropTypes.oneOf(propositionStatus),
    changeStatus: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { fieldName }) => ({
    contributor: fromResource.getResourceContributorForField(state, fieldName),
    loggedIn: fromUser.isLoggedIn(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(ModerateButtonComponent);
