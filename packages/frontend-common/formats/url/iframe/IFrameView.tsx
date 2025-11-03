import type { Field } from '../../../fields/types';

interface IFrameViewProps {
    field: Field;
    resource: object;
    viewWidth: string;
    aspectRatio: string;
}

const IFrameView = ({
    resource,
    field,
    viewWidth,
    aspectRatio,
}: IFrameViewProps) => {
    // @ts-expect-error TS7053
    const srcURL = resource[field.name];
    const style = {
        overflow: 'hidden',
        width: viewWidth,
        aspectRatio,
    };

    return (
        <iframe
            style={style}
            src={srcURL}
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin"
        />
    );
};

export default IFrameView;
