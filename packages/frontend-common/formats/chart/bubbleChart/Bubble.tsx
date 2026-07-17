import type { CSSProperties } from 'react';
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
        boxSizing: 'border-box',

        backgroundColor: color,
        color: hsl(color).l > 0.57 ? '#222' : '#fff',

        alignItems: 'center',
        borderRadius: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'hidden',

        /*
         * La place de la bordure est réservée en permanence.
         * Le texte ne change donc plus de position au survol.
         */
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'transparent',

        ...(isSelected
            ? {
                  backgroundColor: hsl(color).darker(0.5).toString(),
                  borderColor: '#000',
              }
            : {}),

        ...(interactive && {
            cursor: 'pointer',

            '&:hover': {
                backgroundColor: hsl(color).darker(0.5).toString(),
                borderColor: '#000',
            },
        }),
    })),

    leafLabel: memoize(
        ({
            r,
            lineClamp,
        }: {
            r: number;
            lineClamp: number;
        }): CSSProperties => ({
            width: '88%',
            maxWidth: '88%',
            maxHeight: '78%',
            boxSizing: 'border-box',

            padding: r < 22 ? '1px' : '2px',

            textAlign: 'center',
            fontSize: Math.max(7, Math.min(15, r / 3)),
            lineHeight: 1.05,
            fontWeight: 500,

            /*
             * Les retours à la ligne se font uniquement
             * entre les mots.
             */
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            hyphens: 'none',

            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lineClamp,

            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }),
    ),
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
    const showLabel = r >= 14;

    const lineClamp = r < 22 ? 2 : r < 38 ? 3 : r < 65 ? 4 : 5;

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
            {showLabel && (
                <div
                    style={styles.leafLabel({
                        r,
                        lineClamp,
                    })}
                >
                    {name}
                </div>
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
