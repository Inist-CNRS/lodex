import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { newResourceAnnotated } from '../../../../packages/public-app/src/search/reducer';

export const getStorageKey = () =>
    // @ts-expect-error TS2339
    `${window.__TENANT__ || 'default'}:annotation`;

const AnnotationStorageContext = createContext({
    annotations: {},
});

type AnnotationStorageProviderProps = {
    children: React.ReactNode;
};

export const AnnotationStorageProvider = ({
    children,
}: AnnotationStorageProviderProps) => {
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
                // @ts-expect-error TS2561
                setAnnotations,
            }}
        >
            {children}
        </AnnotationStorageContext.Provider>
    );
};

// @ts-expect-error TS7031
export const useGetFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    const { annotations } = useContext(AnnotationStorageContext);

    return useMemo(
        // @ts-expect-error TS7053
        () => annotations[resourceUri]?.[fieldId] || [],
        [annotations, resourceUri, fieldId],
    );
};

export const useSaveAnnotationId = () => {
    // @ts-expect-error TS2339
    const { setAnnotations } = useContext(AnnotationStorageContext);
    const dispatch = useDispatch();

    return useCallback(
        // @ts-expect-error TS7031
        ({ fieldId, resourceUri, _id }) => {
            // @ts-expect-error TS7006
            setAnnotations((annotations) => {
                if (!annotations[resourceUri]) {
                    dispatch(newResourceAnnotated({ resourceUri }));
                }

                return {
                    ...annotations,
                    [resourceUri]: {
                        ...(annotations[resourceUri] ?? {}),
                        [fieldId]: (
                            annotations[resourceUri]?.[fieldId] || []
                        ).concat(_id),
                    },
                };
            });
        },
        [setAnnotations, dispatch],
    );
};

// @ts-expect-error TS7031
export const useSetFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    // @ts-expect-error TS2339
    const { setAnnotations } = useContext(AnnotationStorageContext);

    return useCallback(
        // @ts-expect-error TS7006
        (ids) => {
            // @ts-expect-error TS7006
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
export const useGetAnnotatedResourceUris = () => {
    const { annotations } = useContext(AnnotationStorageContext);

    return useMemo(() => Object.keys(annotations), [annotations]);
};
