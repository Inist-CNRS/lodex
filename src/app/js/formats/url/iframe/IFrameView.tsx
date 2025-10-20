// @ts-expect-error TS6133
import React from 'react';
import { field as fieldPropTypes } from '../../../propTypes';

interface IFrameViewProps {
    field: unknown;
    resource: object;
    viewWidth: string;
    aspectRatio: string;
}

const IFrameView = ({
    resource,
    field,
    viewWidth,
    aspectRatio
}: IFrameViewProps) => {
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

IFrameView.defaultProps = {
    className: null,
};

export default IFrameView;
