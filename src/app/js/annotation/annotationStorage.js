import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const getKey = ({ fieldId, resourceUri }) =>
    `annotation_${fieldId}_${resourceUri ?? 'none'}`;

export const getFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    const annotationIds = localStorage.getItem(
        `annotation_${fieldId}_${resourceUri ?? 'none'}`,
    );
    if (!annotationIds) {
        return [];
    }
    return JSON.parse(annotationIds);
};

export const setFieldAnnotationIds = ({ fieldId, resourceUri, ids }) => {
    localStorage.setItem(
        `annotation_${fieldId}_${resourceUri ?? 'none'}`,
        JSON.stringify(ids || []),
    );
};

export const saveAnnotationId = ({ fieldId, resourceUri, _id }) => {
    const currentAnnotationIds = getFieldAnnotationIds({
        fieldId,
        resourceUri,
    });
    localStorage.setItem(
        `annotation_${fieldId}_${resourceUri ?? 'none'}`,
        JSON.stringify(currentAnnotationIds.concat(_id)),
    );
};

const AnnotationStorageContext = createContext({
    annotations: {},
});

export const AnnotationStorageProvider = ({ children }) => {
    const [annotations, setAnnotations] = useState({});

    return (
        <AnnotationStorageContext.Provider
            value={{
                annotations,
                setAnnotations,
            }}
        >
            {children}
        </AnnotationStorageContext.Provider>
    );
};

AnnotationStorageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useGetFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    const { annotations, setAnnotations } = useContext(
        AnnotationStorageContext,
    );
    const key = getKey({ fieldId, resourceUri });
    if (annotations[key]) {
        return annotations[key];
    }

    const storedAnnotationIds = getFieldAnnotationIds({ fieldId, resourceUri });

    setAnnotations((annotations) => ({
        ...annotations,
        [key]: storedAnnotationIds,
    }));

    return storedAnnotationIds;
};

export const useSaveAnnotationId = () => {
    const { setAnnotations } = useContext(AnnotationStorageContext);

    return ({ fieldId, resourceUri, _id }) => {
        const key = getKey({ fieldId, resourceUri });
        saveAnnotationId({ fieldId, resourceUri, _id });
        setAnnotations((annotations) => ({
            ...annotations,
            [key]: (annotations[key] || []).concat(_id),
        }));
    };
};

export const useSetFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    const { setAnnotations } = useContext(AnnotationStorageContext);

    return (ids) => {
        setFieldAnnotationIds({ fieldId, resourceUri, ids });
        setAnnotations((annotations) => ({
            ...annotations,
            [getKey({ fieldId, resourceUri })]: ids,
        }));
    };
};
