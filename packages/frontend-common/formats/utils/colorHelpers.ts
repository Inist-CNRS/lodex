export const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

export const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const opacityToHex = (opacity: number) => {
    const alpha = Math.round(opacity * 255);
    return alpha.toString(16).padStart(2, '0');
};

export const addTransparency = (hexColor: string, alpha: number) => {
    return hexColor + opacityToHex(alpha);
};
