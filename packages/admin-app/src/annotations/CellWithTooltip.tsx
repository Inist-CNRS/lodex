import { Typography } from '@mui/material';

interface CellWithTooltipProps {
    value: string;
}

export const CellWithTooltip = ({ value }: CellWithTooltipProps) => {
    return (
        <Typography
            title={value}
            sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            }}
        >
            {value}
        </Typography>
    );
};
