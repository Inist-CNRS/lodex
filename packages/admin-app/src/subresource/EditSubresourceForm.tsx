import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation, useParams } from 'react-router';

import SubresourceForm from './SubresourceForm';
import { DeleteSubresourceButton } from './DeleteSubresourceButton';

import {
    updateSubresource as updateSubresourceAction,
    deleteSubresource as deleteSubresourceAction,
    type SubResource,
} from './index';
import { fromSubresources } from '../selectors';

export const EditSubresourceForm = () => {
    const params = useParams<{
        subresourceId: string;
    }>();

    const dispatch = useDispatch();
    const onDelete = useCallback(() => {
        dispatch(deleteSubresourceAction(params.subresourceId));
    }, [params.subresourceId, dispatch]);

    const onSubmit = useCallback(
        (values: SubResource) => {
            dispatch(updateSubresourceAction(values));
        },
        [dispatch],
    );
    const subresources = useSelector(fromSubresources.getSubresources);
    const isLoading = useSelector(fromSubresources.isLoading);
    const initialValues = useMemo(() => {
        return subresources.find(({ _id }) => _id === params.subresourceId);
    }, [subresources, params.subresourceId]);
    const location = useLocation();

    if (isLoading) {
        return null;
    }
    if (!initialValues) {
        return <Redirect to={`${location.pathname}/subresource`} />;
    }
    return (
        <SubresourceForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            additionnalActions={<DeleteSubresourceButton onClick={onDelete} />}
        />
    );
};
