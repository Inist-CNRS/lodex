const {
    saveAnnotationId,
    getFieldAnnotationIds,
} = require('./annotationStorage');

describe('annotationStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    describe('saveAnnotationId', () => {
        it('should save the annotation id under annotation_fieldId_resourceUri', () => {
            saveAnnotationId({
                fieldId: 'fieldId',
                resourceUri: 'resourceUri',
                _id: '_id',
            });
            const annotationIds = localStorage.getItem(
                'annotation_fieldId_resourceUri',
            );
            expect(annotationIds).toBe('["_id"]');
        });

        it('should add the annotation id to the existing annotation ids', () => {
            localStorage.setItem('annotation_fieldId_resourceUri', '["id1"]');
            saveAnnotationId({
                fieldId: 'fieldId',
                resourceUri: 'resourceUri',
                _id: '_id',
            });
            const annotationIds = localStorage.getItem(
                'annotation_fieldId_resourceUri',
            );
            expect(annotationIds).toBe('["id1","_id"]');
        });
        it('should save the annotation id under annotation_fieldId_none if resourceUri is not provided', () => {
            saveAnnotationId({
                fieldId: 'fieldId',
                _id: '_id',
            });
            const annotationIds = localStorage.getItem(
                'annotation_fieldId_none',
            );
            expect(annotationIds).toBe('["_id"]');
        });
    });
    describe('getFieldAnnotationIds', () => {
        it('should return an empty array if there are no annotation ids', () => {
            const annotationIds = getFieldAnnotationIds({
                fieldId: 'fieldId',
                resourceUri: 'resourceUri',
            });
            expect(annotationIds).toEqual([]);
        });

        it('should return the annotation ids for the field and resourceUri', () => {
            localStorage.setItem(
                'annotation_fieldId_resourceUri',
                '["id1","id2","id3"]',
            );
            const annotationIds = getFieldAnnotationIds({
                fieldId: 'fieldId',
                resourceUri: 'resourceUri',
            });
            expect(annotationIds).toEqual(['id1', 'id2', 'id3']);
        });
    });
});
