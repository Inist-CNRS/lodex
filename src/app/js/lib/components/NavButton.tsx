// @ts-expect-error TS6133
import React from 'react';
import classnames from 'classnames';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        root: {
            height: '48px !important',
            width: '48px !important',
            padding: '0px !important',
        },
        icon: {
            color: 'var(--primary-main)',
            ':hover': {
                color: 'var(--info-main)',
            },
            ':active': {
                color: 'var(--secondary-main)',
            },
        },
    },
    'nav-button',
);

export const NEXT = 'next';
export const PREV = 'previous';
export const NONE = '';

// @ts-expect-error TS7006
const renderIcon = (direction) =>
    direction === NEXT ? (
        <FontAwesomeIcon
            // @ts-expect-error TS2339
            className={styles.icon}
            icon={faAngleRight}
            color="var(--primary-main)"
            height={36}
        />
    ) : (
        <FontAwesomeIcon
            // @ts-expect-error TS2339
            className={styles.icon}
            icon={faAngleLeft}
            color="var(--primary-main)"
            height={36}
        />
    );

interface NavButtonProps {
    p: any;
    direction?: string;
    navigate(direction: string): void;
}

const NavButton = ({ p: polyglot, direction, navigate }: NavButtonProps) => {
    if (!direction) {
        return null;
    }

    const label = polyglot.t(direction);
    const icon = renderIcon(direction);
    const handleNavigate = () => navigate(direction);

    return (
        // @ts-expect-error TS2769
        <IconButton
            // @ts-expect-error TS2339
            className={classnames(`nav-button-${direction}`, styles.root)}
            tooltip={label}
            tooltipPosition="bottom-center"
            onClick={handleNavigate}
        >
            {icon}
        </IconButton>
    );
};

NavButton.defaultProps = {
    direction: NONE,
    navigate: () => {},
};

// @ts-expect-error TS2345
export default compose(translate)(NavButton);
