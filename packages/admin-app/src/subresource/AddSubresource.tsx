import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import {
    createSubresource as createSubresourceAction,
    type SubResource,
} from './index';
import SubresourceForm from './SubresourceForm';
import { useCallback } from 'react';

export const AddSubresource = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const onSubmit = useCallback(
        (resource: SubResource) => {
            dispatch(
                createSubresourceAction({
                    resource,
                    callback: (id: string) =>
                        history.push(`/display/document/subresource/${id}`),
                }),
            );
        },
        [history, dispatch],
    );
    return <SubresourceForm onSubmit={onSubmit} />;
};
