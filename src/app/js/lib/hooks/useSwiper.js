// Inspired by https://codesandbox.io/s/useswiperjs-f9x3t

import { useState, useEffect } from 'react';

export const SWIPE_NONE = 'none';
export const SWIPE_LEFT = 'left';
export const SWIPE_RIGHT = 'right';

const DEFAULT_MIN_DELTA = 15;

const isMoving = (deltaX, minDelta) => Math.abs(deltaX) > minDelta;

const getDirection = deltaX => (deltaX > 0 ? SWIPE_RIGHT : SWIPE_LEFT);

const startEvents = ['mousedown', 'touchstart'];
const moveEvents = ['mousemove', 'touchmove'];
const stopEvents = ['mouseup', 'touchend'];

const subscribeToEvents = ({ handleStart, handleMove, handleStop }) => {
    if (startEvents) {
        startEvents.forEach(event =>
            document.addEventListener(event, handleStart),
        );
    }
    if (moveEvents) {
        moveEvents.forEach(event =>
            document.addEventListener(event, handleMove),
        );
    }
    if (stopEvents) {
        stopEvents.forEach(event =>
            document.addEventListener(event, handleStop),
        );
    }
};

const unSubscribeToEvents = ({ handleStart, handleMove, handleStop }) => {
    if (startEvents) {
        startEvents.forEach(event =>
            document.removeEventListener(event, handleStart),
        );
    }
    if (moveEvents) {
        moveEvents.forEach(event =>
            document.removeEventListener(event, handleMove),
        );
    }
    if (stopEvents) {
        stopEvents.forEach(event =>
            document.removeEventListener(event, handleStop),
        );
    }
};

export default (minDelta = DEFAULT_MIN_DELTA) => {
    const [coordsX, setCoordsX] = useState(-1);
    const [swipeDirection, setSwipeDirection] = useState(SWIPE_NONE);

    const handleStart = event => {
        setCoordsX(event.clientX);
    };

    const handleMove = event => {
        const deltaX = coordsX - event.clientX;
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
    });

    useEffect(() => {
        if (coordsX !== -1) {
            subscribeToEvents({ handleMove, handleStop });
        } else {
            unSubscribeToEvents({ handleMove, handleStop });
        }

        return () => {
            unSubscribeToEvents({ handleStart, handleMove, handleStop });
        };
    }, [coordsX]);

    return swipeDirection;
};
