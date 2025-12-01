import { darken, lighten } from '@mui/material/styles';
import { useCallback } from 'react';
import { addTransparency } from '../../utils/colorHelpers';

export function useLinkColor({
    mode,
    minLinkSize,
    maxLinkSize,
}: UseLinkColorParams) {
    return useCallback(
        <T extends Link>(link: T) => {
            const color = link.color ?? '#d0d0d0';
            if (mode === 'arrow') {
                const value = link.value ?? 1;
                const ratio =
                    (value - minLinkSize) / (maxLinkSize - minLinkSize || 1);

                const adjustColor = ratio < 0.5 ? lighten : darken;
                const coefficient = Math.abs((ratio - 0.5) * 2 * 0.5);
                return adjustColor(color, coefficient);
            }

            return addTransparency(color, 0.6);
        },
        [mode, minLinkSize, maxLinkSize],
    );
}

type UseLinkColorParams = {
    mode: 'arrow' | 'animated';
    minLinkSize: number;
    maxLinkSize: number;
};

type Link = {
    color?: string | undefined;
    value?: number | undefined;
};
