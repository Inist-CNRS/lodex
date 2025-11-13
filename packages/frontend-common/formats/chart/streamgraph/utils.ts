import differenceBy from 'lodash/differenceBy';

// @ts-expect-error TS7006
export function zoomFunction(event) {
    // create new scale ojects based on event
    // @ts-expect-error TS2683
    const new_xScale = event.transform.rescaleX(this.xAxisScale);
    // @ts-expect-error TS2683
    const new_yScale = event.transform.rescaleY(this.yAxisScale);

    // update axes
    // @ts-expect-error TS2683
    this.gx.call(this.xAxis.scale(new_xScale));
    // @ts-expect-error TS2683
    this.gyr.call(this.yAxisR.scale(new_yScale));
    // @ts-expect-error TS2683
    this.gyl.call(this.yAxisL.scale(new_yScale));

    // update streams
    // @ts-expect-error TS2683
    this.streams.attr('transform', event.transform);
}

// @ts-expect-error TS7006
export function distinctColors(count) {
    const colors = [];
    for (let hue = 0; hue < 360; hue += 360 / count) {
        colors.push(hslToHex(hue, 90, 50));
    }
    return colors;
}

// @ts-expect-error TS7006
export function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        // @ts-expect-error TS7006
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    // @ts-expect-error TS7006
    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// @ts-expect-error TS7006
export function transformDataIntoMapArray(formatData) {
    let dateMin = -42;
    let dateMax = -42;
    const valuesObjectsArray = [];

    if (formatData) {
        for (let i = 0; i < formatData.length; i++) {
            const elem = formatData[i];

            if (elem) {
                // source: "2010"
                // target: "Pétrogenèse de roches basaltiques"
                // weight: 0.9013102637325718

                if (elem.source && elem.weight) {
                    let currentItem = undefined;

                    for (const tmpElem of valuesObjectsArray) {
                        if (tmpElem.name === elem.target) {
                            currentItem = tmpElem;
                        }
                    }

                    let addValueAsSum = false;
                    if (currentItem === undefined) {
                        currentItem = {
                            name: elem.target,
                            values: [],
                        };
                        valuesObjectsArray.push(currentItem);
                    } else {
                        for (const valueElem of currentItem.values) {
                            if (
                                // @ts-expect-error TS2339
                                parseInt(valueElem.date.getFullYear()) ===
                                parseInt(elem.source)
                            ) {
                                // @ts-expect-error TS2339
                                const sum = valueElem.value + elem.weight;
                                // @ts-expect-error TS2339
                                valueElem.value = parseFloat(sum.toFixed(3));
                                addValueAsSum = true;
                                break;
                            }
                        }
                    }

                    if (!addValueAsSum) {
                        // @ts-expect-error TS2345
                        currentItem.values.push({
                            date: new Date(elem.source),
                            value: elem.weight,
                        });
                    }

                    if (
                        parseInt(elem.source, 10) < dateMin ||
                        dateMin === -42
                    ) {
                        dateMin = parseInt(elem.source, 10);
                    }
                    if (
                        parseInt(elem.source, 10) > dateMax ||
                        dateMax === -42
                    ) {
                        dateMax = parseInt(elem.source, 10);
                    }
                }
            }
        }
        // display the datas at the center when only one x value
        if (dateMin == dateMax) {
            dateMin--;
            dateMax++;
        }
    }

    const namesList = valuesObjectsArray.map((value) => value.name);

    let currentDate = dateMin;
    const valuesArray = [];

    while (currentDate <= dateMax) {
        const tmpName = [];
        const newElem = {
            date: new Date(String(currentDate)),
        };

        for (const element of valuesObjectsArray) {
            // loop which add each values for the good year
            for (const dateValue of element.values) {
                // @ts-expect-error TS2339
                if (dateValue.date.getFullYear() == currentDate) {
                    // @ts-expect-error TS7053
                    newElem[element.name] = dateValue.value;
                    tmpName.push(element.name);
                }
            }

            // loop which add 0 value to the missing keys
            const resMissingNameList = differenceBy(namesList, tmpName);
            for (const elemToAdd of resMissingNameList) {
                // @ts-expect-error TS7053
                newElem[elemToAdd] = 0;
            }
        }

        valuesArray.push(newElem);
        currentDate++;
    }

    return { valuesObjectsArray, valuesArray, dateMin, dateMax, namesList };
}

// @ts-expect-error TS7006
export function getMinMaxValue(stackedData) {
    let minValue = 0;
    let maxValue = 0;

    if (stackedData) {
        for (const element of stackedData) {
            for (const value of element) {
                if (minValue > value[0]) {
                    minValue = value[0];
                }
                if (maxValue < value[1]) {
                    maxValue = value[1];
                }
            }
        }
    }

    return { minValue, maxValue };
}

// @ts-expect-error TS7006
export function findFirstTickPosition(uniqueId) {
    // @ts-expect-error TS2531
    const containerXPosition = document
        .querySelector(`#divContainer${uniqueId}`)
        .getBoundingClientRect().left;
    document
        .querySelectorAll(`.xAxis${uniqueId} .tick`)
        .forEach(function (value) {
            return value.getBoundingClientRect().left - containerXPosition;
        });
    return 0;
}

// @ts-expect-error TS7006
export function findNearestTickPosition(cursorPosition, uniqueId) {
    // @ts-expect-error TS2531
    const containerXPosition = document
        .querySelector(`#divContainer${uniqueId}`)
        .getBoundingClientRect().left;
    // @ts-expect-error TS7034
    const ticksPositionAndValueList = [];
    document
        .querySelectorAll(`.xAxis${uniqueId} .tick`)
        .forEach(function (value) {
            ticksPositionAndValueList.push({
                position:
                    value.getBoundingClientRect().left -
                    containerXPosition +
                    value.getBoundingClientRect().width / 2 -
                    1,
                value: value.children[1].innerHTML,
            });
        });

    let tickPosition = cursorPosition + 10000;
    let tickValue;
    // @ts-expect-error TS7005
    ticksPositionAndValueList.forEach(function (value) {
        if (
            Math.abs(cursorPosition - value.position) <
            Math.abs(cursorPosition - tickPosition)
        ) {
            tickPosition = value.position;
            tickValue = value.value;
        }
    });
    return { tickPosition, tickValue };
}

export function generateUniqueId(length = 8) {
    const chars =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(
            '',
        );

    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
