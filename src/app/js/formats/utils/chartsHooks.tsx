import { useEffect, useRef, useState } from 'react';

/**
 * Hook a ref object and observe the resize event
 * @returns {{ref: React.MutableRefObject<null>, width: number}}
 */
export const useSizeObserver = () => {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref || !ref.current) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            window.requestAnimationFrame(() => {
                if (
                    !Array.isArray(entries) ||
                    !entries.length ||
                    entries.length < 1
                ) {
                    return;
                }
                setWidth(entries[0].contentRect.width);
            });
        });

        resizeObserver.observe(ref.current);
    }, [ref.current]);

    return {
        ref,
        width,
    };
};
