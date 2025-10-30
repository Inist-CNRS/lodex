import { useEffect, useRef } from 'react';

// @ts-expect-error TS7006
export function useDidUpdateEffect(fn, inputs) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current) return fn();
        else didMountRef.current = true;
    }, inputs);
}
