import pure from 'recompose/pure';
import { CircularProgress, TableCell, type SxProps } from '@mui/material';
import { isLongText, getShortText } from '../../lib/longTexts';

interface ParsingExcerptColumnComponentProps {
    children?: React.ReactNode;
    sx?: SxProps;
    value: string;
    isEnrichmentLoading?: boolean;
}

export const ParsingExcerptColumnComponent = ({
    children,
    sx,
    value,
    isEnrichmentLoading,
}: ParsingExcerptColumnComponentProps) => (
    <TableCell
        sx={
            [
                {
                    position: 'relative',
                    minWidth: '10rem',
                    overflow: 'visible',
                    height: '6rem',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ] as SxProps
        }
        title={value}
    >
        {isEnrichmentLoading && value === undefined ? (
            <>
                <CircularProgress variant="indeterminate" size={20} />
            </>
        ) : (
            <>
                {isLongText(value) ? getShortText(value) : `${value}`}
                {children}
            </>
        )}
    </TableCell>
);

ParsingExcerptColumnComponent.defaultProps = {
    children: null,
    style: null,
};

export default pure(ParsingExcerptColumnComponent);
