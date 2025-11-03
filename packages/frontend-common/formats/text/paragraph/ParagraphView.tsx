import type { Field } from '@lodex/frontend-common/fields/types';

// @ts-expect-error TS7006
const getParagraphWidth = (paragraphWidth, field) => {
    if (field.format.args.paragraphWidth) {
        return field.format.args.paragraphWidth;
    }
    return paragraphWidth;
};

interface ParagraphViewProps {
    field: Field;
    resource: object;
    paragraphWidth: string;
    colors: string;
}

const ParagraphView = ({
    resource,
    field,
    paragraphWidth,
    colors,
}: ParagraphViewProps) => {
    const style = {
        maxWidth: getParagraphWidth(paragraphWidth, field),
        padding: 8,
        textAlign: 'justify',
        color: colors.split(' ')[0],
    };

    // @ts-expect-error TS2322
    return <p style={style}>{resource[field.name]}</p>;
};

export default ParagraphView;
