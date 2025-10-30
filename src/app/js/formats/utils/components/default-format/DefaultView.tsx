import { Typography } from '@mui/material';
import {
    PROPOSED,
    REJECTED,
    VALIDATED,
} from '../../../../../../common/propositionStatus';
import { canonicalURL, isLocalURL, isURL } from '../../../../../../common/uris';
import Link from '../../../../lib/components/Link';
import { getShortText, isLongText } from '../../../../lib/longTexts';
import { type Field } from '../../../../propTypes';

const styles = {
    [REJECTED]: {
        fontSize: '1rem',
        textDecoration: 'line-through',
    },
    [PROPOSED]: {
        fontSize: '1rem',
        textDecoration: 'none',
    },
    [VALIDATED]: {
        fontSize: '1rem',
        textDecoration: 'none',
    },
};

interface DefaultViewProps {
    className?: string;
    field: Field;
    fieldStatus?: string;
    resource: any;
    shrink?: boolean;
}

const DefaultView = ({
    className,
    resource,
    field,
    fieldStatus,
    shrink,
}: DefaultViewProps) => {
    const value = resource[field.name];

    if (isURL(value)) {
        return (
            // @ts-expect-error TS2739
            <Link style={styles[fieldStatus]} href={`${value}`}>
                {value}
            </Link>
        );
    }
    if (isLocalURL(value)) {
        return (
            // @ts-expect-error TS2739
            <Link style={styles[fieldStatus]} href={`${canonicalURL(value)}`}>
                {value}
            </Link>
        );
    }

    const text = shrink && isLongText(value) ? getShortText(value) : value;
    return (
        <Typography
            component="span"
            className="property_value_item"
            // @ts-expect-error TS(7053): Element implicitly has an any type because expression of type string can't be used to index type
            sx={styles[fieldStatus]}
        >
            <span className={className}>{text}</span>
        </Typography>
    );
};

export default DefaultView;

// @ts-expect-error TS7031
export const getReadableValue = ({ resource, field }) => {
    return resource[field.name];
};
