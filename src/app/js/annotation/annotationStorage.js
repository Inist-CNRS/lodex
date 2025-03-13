import PropTypes from 'prop-types';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export const getStorageKey = () =>
    `${window.__TENANT__ || 'default'}:annotation`;

const AnnotationStorageContext = createContext({
    annotations: {},
});

export const AnnotationStorageProvider = ({ children }) => {
    const storedAnnotations = useMemo(() => {
        return JSON.parse(localStorage.getItem(getStorageKey()) || '{}');
    }, []);

    const [annotations, setAnnotations] = useState(storedAnnotations);

    useEffect(() => {
        localStorage.setItem(getStorageKey(), JSON.stringify(annotations));
    }, [annotations]);

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
    const { annotations } = useContext(AnnotationStorageContext);

    return useMemo(
        () => annotations[resourceUri]?.[fieldId] || [],
        [annotations, resourceUri, fieldId],
    );
};

export const useSaveAnnotationId = () => {
    const { setAnnotations } = useContext(AnnotationStorageContext);

    return useCallback(
        ({ fieldId, resourceUri, _id }) => {
            setAnnotations((annotations) => ({
                ...annotations,
                [resourceUri]: {
                    ...(annotations[resourceUri] ?? {}),
                    [fieldId]: (
                        annotations[resourceUri]?.[fieldId] || []
                    ).concat(_id),
                },
            }));
        },
        [setAnnotations],
    );
};

export const useSetFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    const { setAnnotations } = useContext(AnnotationStorageContext);

    return useCallback(
        (ids) => {
            setAnnotations((annotations) => ({
                ...annotations,
                [resourceUri]: {
                    ...(annotations[resourceUri] ?? {}),
                    [fieldId]: ids,
                },
            }));
        },
        [setAnnotations, fieldId, resourceUri],
    );
};

// not a hook, since this need to be use inside saga
export const getAnnotatedResourceUris = () => {
    const annotations = JSON.parse(
        localStorage.getItem(getStorageKey()) || '{}',
    );

    return Object.keys(annotations);
};
