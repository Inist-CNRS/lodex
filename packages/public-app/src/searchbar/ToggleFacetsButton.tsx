import { IconButton } from '@mui/material';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import stylesToClassName from '../../../../src/app/js/lib/stylesToClassName';

const styles = stylesToClassName(
    {
        icon: {
            color: 'var(--primary-main)',
        },
    },
    'searchbar-facets-toggler',
);

interface ToggleFacetsButtonProps {
    className: string;
    onChange(...args: unknown[]): unknown;
}

const ToggleFacetsButton = ({
    className = 'searchbar-facets-toggler',
    onChange,
}: ToggleFacetsButtonProps) => (
    <IconButton className={className} onClick={onChange}>
        {/*
         // @ts-expect-error TS2339 */}
        <FontAwesomeIcon className={styles.icon} icon={faFilter} height={20} />
    </IconButton>
);

export default ToggleFacetsButton;
