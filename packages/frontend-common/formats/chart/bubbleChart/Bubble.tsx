import memoize from 'lodash/memoize';
// @ts-expect-error TS7016
import { hsl } from 'd3-color';
import ReactTooltip from 'react-tooltip';
import { Box } from '@mui/material';

const styles = {
    leaf: memoize(({ x, y, r, color, interactive, isSelected }) => ({
        position: 'absolute',
        top: x - r,
        left: y - r,
        width: r * 2,
        height: r * 2,
        backgroundColor: color,
        color: hsl(color).l > 0.57 ? '#222' : '#fff',
        alignItems: 'center',
        borderRadius: '100%',
        display: 'flex',
        justifyContent: 'center',
        ...(isSelected
            ? {
                  backgroundColor: hsl(color).darker(0.5).toString(),
                  borderSize: '1px',
                  borderStyle: 'solid',
                  borderColor: '#000',
              }
            : {}),
        ...(interactive && {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: hsl(color).darker(0.5).toString(),
                borderSize: '1px',
                borderStyle: 'solid',
                borderColor: '#000',
            },
        }),
    })),
    leafLabel: memoize(({ r }) => ({
        overflow: 'hidden',
        padding: '10px',
        textOverflow: 'ellipsis',
        textAlign: 'center',
        fontSize: r / 3,
    })),
};

interface BubbleProps {
    r: number;
    x: number;
    y: number;
    name: string;
    color: string;
    value: number;
    onClick?: (name: string) => void;
    isSelected?: boolean;
}

const Bubble = ({
    r,
    x,
    y,
    name,
    value,
    color,
    onClick,
    isSelected,
}: BubbleProps) => {
    return (
        <Box
            sx={styles.leaf({
                r,
                x,
                y,
                color,
                interactive: !!onClick,
                isSelected,
            })}
            data-tip={`${name}: ${value}`}
            data-for={`bubble-${name}`}
            data-iscapture="true"
            onClick={() => onClick?.(name)}
        >
            {r > 10 && (
                // @ts-expect-error TS7006
                <div style={styles.leafLabel({ r, x, y }, color)}>{name}</div>
            )}
            <ReactTooltip
                id={`bubble-${name}`}
                place="top"
                type="light"
                effect="float"
                getContent={(dataTip) => dataTip}
            />
        </Box>
    );
};

export default Bubble;
