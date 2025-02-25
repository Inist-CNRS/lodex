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

export const getFieldKey = ({ fieldId, resourceUri }) =>
    `${fieldId}:${resourceUri ?? 'none'}`;

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
    const key = getFieldKey({ fieldId, resourceUri });

    return useMemo(() => annotations[key] || [], [annotations, key]);
};

export const useSaveAnnotationId = () => {
    const { setAnnotations } = useContext(AnnotationStorageContext);

    return useCallback(
        ({ fieldId, resourceUri, _id }) => {
            const key = getFieldKey({ fieldId, resourceUri });
            setAnnotations((annotations) => ({
                ...annotations,
                [key]: (annotations[key] || []).concat(_id),
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
                [getFieldKey({ fieldId, resourceUri })]: ids,
            }));
        },
        [setAnnotations, fieldId, resourceUri],
    );
};
