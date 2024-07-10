export const sizeConverter = (value) => {
    if (value == null) {
        return '-';
    }

    const mbSize = (value / 1024).toFixed(2);

    if (mbSize > 1024) {
        return `${(mbSize / 1024).toFixed(2)} Gio`;
    }

    if (mbSize > 1) {
        return `${mbSize} Mio`;
    }

    return `${value} Kio`;
};
