import { IconButton } from '@mui/material';
import RejectedIcon from '@mui/icons-material/Clear';
import ProposedIcon from '@mui/icons-material/Remove';
import ValidatedIcon from '@mui/icons-material/Done';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { red, yellow, green, grey } from '@mui/material/colors';
import classnames from 'classnames';

import { propositionStatuses, type PropositionStatusType } from '@lodex/common';
import { fromResource } from '../selectors';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';

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

// @ts-expect-error TS7006
const getIcons = (status, active) => {
    // @ts-expect-error TS7053
    const Icon = icons[status];

    return (
        <Icon
            // @ts-expect-error TS7053
            color={active ? colors[status] : grey[500]}
            // @ts-expect-error TS7053
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

interface ModerateButtonComponentProps {
    contributor?: string;
    status?: PropositionStatusType;
    changeStatus(
        status: PropositionStatusType,
        availableStatus: PropositionStatusType,
    ): void;
    isAdmin: boolean;
}

export const ModerateButtonComponent = ({
    contributor,
    status,
    changeStatus,
    isAdmin,
}: ModerateButtonComponentProps) => {
    const { translate } = useTranslate();
    if (!isAdmin || !status || !contributor) {
        return null;
    }
    return (
        <div className="moderate">
            {propositionStatuses.map((availableStatus) => (
                // @ts-expect-error TS2769
                <IconButton
                    className={classnames(availableStatus, {
                        active: availableStatus === status,
                    })}
                    sx={styles.iconButton}
                    key={availableStatus}
                    tooltip={translate(availableStatus)}
                    onClick={(e) => {
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { fieldName }) => ({
    contributor: fromResource.getResourceContributorForField(state, fieldName),
    isAdmin: fromUser.isAdmin(state),
});

export default compose(
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(ModerateButtonComponent);
