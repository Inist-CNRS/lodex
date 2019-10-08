// Inspired by https://codesandbox.io/s/useswiperjs-f9x3t

import { useState, useEffect } from 'react';

export const SWIPE_NONE = 'none';
export const SWIPE_LEFT = 'left';
export const SWIPE_RIGHT = 'right';

const DEFAULT_MIN_DELTA = 30;

const isMoving = (deltaX, minDelta) => Math.abs(deltaX) > minDelta;

const getDirection = deltaX => (deltaX > 0 ? SWIPE_RIGHT : SWIPE_LEFT);

const getCoordsXFromEvent = event =>
    event.touches ? event.touches[0].clientX : event.clientX;

const startEvent = 'touchstart';
const moveEvent = 'touchmove';
const stopEvent = 'touchend';

const subscribeToEvents = ({ handleStart, handleMove, handleStop }) => {
    if (handleStart) {
        document.addEventListener(startEvent, handleStart);
    }
    if (handleMove) {
        document.addEventListener(moveEvent, handleMove);
    }
    if (handleStop) {
        document.addEventListener(stopEvent, handleStop);
    }
};

const unSubscribeToEvents = ({ handleStart, handleMove, handleStop }) => {
    if (handleStart) {
        document.removeEventListener(startEvent, handleStart);
    }
    if (handleMove) {
        document.removeEventListener(moveEvent, handleMove);
    }
    if (handleStop) {
        document.removeEventListener(stopEvent, handleStop);
    }
};

export default (minDelta = DEFAULT_MIN_DELTA) => {
    const [coordsX, setCoordsX] = useState(-1);
    const [swipeDirection, setSwipeDirection] = useState(SWIPE_NONE);

    const handleStart = event => {
        setCoordsX(getCoordsXFromEvent(event));
    };

    const handleMove = event => {
        const deltaX = coordsX - getCoordsXFromEvent(event);
        if (!isMoving(deltaX, minDelta)) {
            return;
        }
        const direction = getDirection(deltaX);
        setSwipeDirection(direction);
    };

    const handleStop = () => {
        setCoordsX(-1);
        setSwipeDirection(SWIPE_NONE);
    };

    useEffect(() => {
        subscribeToEvents({ handleStart });

        return () => {
            unSubscribeToEvents({ handleStart });
        };
    });

    useEffect(() => {
        if (coordsX !== -1) {
            subscribeToEvents({ handleMove, handleStop });
        } else {
            unSubscribeToEvents({ handleMove, handleStop });
        }

        return () => {
            unSubscribeToEvents({ handleMove, handleStop });
        };
    }, [coordsX]);

    return swipeDirection;
};
