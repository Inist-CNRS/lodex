import stylesToClassname from '../../../lib/stylesToClassName';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';

const sizes = ['7rem', '5rem', '2rem'];

const styles = stylesToClassname(
    {
        ribbon: {
            marginTop: '-0.5rem',
            marginBottom: '-0.5rem',
        },
    },
    'big-bold',
);

// @ts-expect-error TS7006
const getContentInlineStyle = (colors, size) => {
    const color = colors.split(' ')[0] || MONOCHROMATIC_DEFAULT_COLORSET;
    const currentSize = sizes[size - 1];
    const fontSize = currentSize || 'inherit';
    const fontWeight = currentSize ? 'bold' : 'normal';
    const letterSpacing = currentSize ? `-0.${5 - size}rem` : 'inherit';

    return {
        fontSize,
        fontWeight,
        letterSpacing,
        color,
    };
};

interface BigboldProps {
    value: string;
    colors: string;
    size: number;
}

const Bigbold = ({ value, colors, size }: BigboldProps) => (
    // @ts-expect-error TS2339
    <div className={styles.ribbon}>
        <div className="content" style={getContentInlineStyle(colors, size)}>
            {value}
        </div>
    </div>
);

export default Bigbold;
