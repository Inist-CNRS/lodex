import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import RejectedIcon from '@mui/icons-material/Clear';
import ProposedIcon from '@mui/icons-material/Remove';
import ValidatedIcon from '@mui/icons-material/Done';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { red, yellow, green, grey } from '@mui/material/colors';
import classnames from 'classnames';

import propositionStatus from '../../../../common/propositionStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import { fromUser } from '../../sharedSelectors';

const icons = {
    PROPOSED: ProposedIcon,
    VALIDATED: ValidatedIcon,
    REJECTED: RejectedIcon,
};

const colors = {
    PROPOSED: yellow[500],
    VALIDATED: green[500],
    REJECTED: red[500],
};

const getIcons = (status, active) => {
    const Icon = icons[status];

    return (
        <Icon
            color={active ? colors[status] : grey[500]}
            hoverColor={colors[status]}
        />
    );
};

const styles = {
    iconButton: {
        padding: 0,
        height: null,
    },
};

export const ModerateButtonComponent = ({
    contributor,
    status,
    changeStatus,
    isAdmin,
    p: polyglot,
}) => {
    if (!isAdmin || !status || !contributor) {
        return null;
    }
    return (
        <div className="moderate">
            {propositionStatus.map(availableStatus => (
                <IconButton
                    className={classnames(availableStatus, {
                        active: availableStatus === status,
                    })}
                    sx={styles.iconButton}
                    key={availableStatus}
                    tooltip={polyglot.t(availableStatus)}
                    onClick={e => {
                        e.preventDefault();
                        changeStatus(status, availableStatus);
                        return false;
                    }}
                >
                    {getIcons(availableStatus, status === availableStatus)}
                </IconButton>
            ))}
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
    isAdmin: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { fieldName }) => ({
    contributor: fromResource.getResourceContributorForField(state, fieldName),
    isAdmin: fromUser.isAdmin(state),
});

export default compose(
    translate,
    connect(mapStateToProps),
)(ModerateButtonComponent);
