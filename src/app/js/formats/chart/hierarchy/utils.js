import differenceBy from 'lodash/differenceBy';
import * as d3 from 'd3';

export function zoomFunction() {
    // create new scale ojects based on event
    const new_xScale = d3.event.transform.rescaleX(this.xAxisScale);
    const new_yScale = d3.event.transform.rescaleY(this.yAxisScale);

    // update axes
    this.gx.call(this.xAxis.scale(new_xScale));
    this.gyr.call(this.yAxisR.scale(new_yScale));
    this.gyl.call(this.yAxisL.scale(new_yScale));

    // update streams
    this.streams.attr('transform', d3.event.transform);
}

export function distinctColors(count) {
    const colors = [];
    for (let hue = 0; hue < 360; hue += 360 / count) {
        colors.push(hslToHex(hue, 90, 50));
    }
    return colors;
}

export function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
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
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function transformDataIntoMapArray(formatData) {
    let dateMin = -42;
    let dateMax = -42;
    const valuesObjectsArray = [];

    if (formatData) {
        for (let i = 0; i < formatData.length; i++) {
            let elem = formatData[i];
            if (elem) {
                // source: "2010"
                // target: "Pétrogenèse de roches basaltiques"
                // weight: 0.9013102637325718

                if (elem.source && elem.weight) {
                    let currentItem = undefined;

                    for (let tmpElem of valuesObjectsArray) {
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
                        for (let valueElem of currentItem.values) {
                            if (
                                parseInt(valueElem.date.getFullYear()) ===
                                parseInt(elem.source)
                            ) {
                                valueElem.value = valueElem.value + elem.weight;
                                addValueAsSum = true;
                                break;
                            }
                        }
                    }

                    if (!addValueAsSum) {
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

    const namesList = valuesObjectsArray.map(value => value.name);

    let currentDate = dateMin;
    const valuesArray = [];

    while (currentDate <= dateMax) {
        let tmpName = [];
        let newElem = {
            date: new Date(String(currentDate)),
        };

        for (let element of valuesObjectsArray) {
            // loop which add each values for the good year
            for (let dateValue of element.values) {
                if (dateValue.date.getFullYear() == currentDate) {
                    newElem[element.name] = dateValue.value;
                    tmpName.push(element.name);
                }
            }

            // loop which add 0 value to the missing keys
            let resMissingNameList = differenceBy(namesList, tmpName);
            for (let elemToAdd of resMissingNameList) {
                newElem[elemToAdd] = 0;
            }
        }

        valuesArray.push(newElem);
        currentDate++;
    }

    return { valuesObjectsArray, valuesArray, dateMin, dateMax, namesList };
}

export function getMinMaxValue(stackedData) {
    let minValue = 0;
    let maxValue = 0;

    if (stackedData) {
        for (let element of stackedData) {
            for (let value of element) {
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

export function cutStr(str) {
    const strSplit = str.split(' ');
    let resStr = '';
    const words_nb = 3;

    for (let i = 0; i < strSplit.length && i < words_nb; i++) {
        if (i < words_nb - 1 || strSplit[i].length > 3) {
            resStr = `${resStr} ${strSplit[i]}`;
        }
    }

    if (strSplit.length > 3) {
        resStr = `${resStr} [...]`;
    }
    return resStr;
}

export function findFirstTickPosition(uniqueId) {
    const containerXPosition = document
        .querySelector(`#divContainer${uniqueId}`)
        .getBoundingClientRect().left;
    document
        .querySelectorAll(`.xAxis${uniqueId} .tick`)
        .forEach(function(value) {
            return value.getBoundingClientRect().left - containerXPosition;
        });
    return 0;
}

export function findNearestTickPosition(cursorPosition, uniqueId) {
    const containerXPosition = document
        .querySelector(`#divContainer${uniqueId}`)
        .getBoundingClientRect().left;
    const ticksPositionAndValueList = [];
    document
        .querySelectorAll(`.xAxis${uniqueId} .tick`)
        .forEach(function(value) {
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
    ticksPositionAndValueList.forEach(function(value) {
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
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(
        '',
    );

    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
