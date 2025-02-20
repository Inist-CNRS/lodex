export const getFieldAnnotationIds = ({ fieldId, resourceUri }) => {
    const annotationIds = localStorage.getItem(
        `annotation_${fieldId}_${resourceUri ?? 'none'}`,
    );
    if (!annotationIds) {
        return [];
    }
    return JSON.parse(annotationIds);
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
