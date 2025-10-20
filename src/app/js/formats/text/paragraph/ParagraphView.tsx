// @ts-expect-error TS6133
import React from 'react';
import { field as fieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7006
const getParagraphWidth = (paragraphWidth, field) => {
    if (field.format.args.paragraphWidth) {
        return field.format.args.paragraphWidth;
    }
    return paragraphWidth;
};

interface ParagraphViewProps {
    field: unknown;
    resource: object;
    paragraphWidth: string;
    colors: string;
}

const ParagraphView = ({
    resource,
    field,
    paragraphWidth,
    colors
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

ParagraphView.defaultProps = {
    className: null,
};

export default ParagraphView;
