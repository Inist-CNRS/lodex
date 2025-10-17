import { getAnnotationNotificationMail } from './getAnnotationNotificationMail';

describe('getAnnotationNotificationMail', () => {
    it('should return english mail content with all annotation details when locale is en', () => {
        expect(
            getAnnotationNotificationMail({
                locale: 'en',
                tenant: 'tenant',
                origin: 'http://localhost:3000',
                annotationWithDetails: {
                    resource: {
                        title: 'Resource title',
                    },
                    field: {
                        label: 'Field label',
                    },
                    initialValue: 'Initial value',
                    proposedValue: 'Proposed value',
                    kind: 'Kind',
                    authorName: 'Author name',
                    comment: 'The Comment',
                },
            }),
        ).toStrictEqual({
            subject: 'An annotation has been added on « tenant »',
            text: `An annotation has been added on « tenant »
Resource: Resource title
Type : Kind
Field: Field label
Initial value: Initial value
Proposed value: Proposed value
Contributor: Author name
Contributor comment: The Comment
See annotation: http://localhost:3000/instance/tenant/admin#/annotations`,
        });
    });
    it('should return english mail content with all annotation details when locale is fr', () => {
        expect(
            getAnnotationNotificationMail({
                locale: 'fr',
                tenant: 'tenant',
                origin: 'http://localhost:3000',
                annotationWithDetails: {
                    resource: {
                        title: 'Resource title',
                    },
                    field: {
                        label: 'Field label',
                    },
                    initialValue: 'Initial value',
                    proposedValue: 'Proposed value',
                    kind: 'Kind',
                    authorName: 'Author name',
                    comment: 'The Comment',
                },
            }),
        ).toStrictEqual({
            subject: 'Une annotation a été ajoutée sur « tenant »',
            text: `Une annotation a été ajoutée sur « tenant »
Ressource : Resource title
Type : Kind
Champ : Field label
Valeur d'origine : Initial value
Valeur proposée : Proposed value
Contributeur : Author name
Commentaire du contributeur : The Comment
Voir l'annotation : http://localhost:3000/instance/tenant/admin#/annotations`,
        });
    });
    it('should omit resource when it is not set', () => {
        expect(
            getAnnotationNotificationMail({
                locale: 'en',
                tenant: 'tenant',
                origin: 'http://localhost:3000',
                annotationWithDetails: {
                    field: {
                        label: 'Field label',
                    },
                    initialValue: 'Initial value',
                    proposedValue: 'Proposed value',
                    kind: 'Kind',
                    authorName: 'Author name',
                    comment: 'The Comment',
                },
            }),
        ).toStrictEqual({
            subject: 'An annotation has been added on « tenant »',
            text: `An annotation has been added on « tenant »
Type : Kind
Field: Field label
Initial value: Initial value
Proposed value: Proposed value
Contributor: Author name
Contributor comment: The Comment
See annotation: http://localhost:3000/instance/tenant/admin#/annotations`,
        });
    });
    it('should omit field when it is not set', () => {
        expect(
            getAnnotationNotificationMail({
                locale: 'en',
                tenant: 'tenant',
                origin: 'http://localhost:3000',
                annotationWithDetails: {
                    resource: {
                        title: 'Resource title',
                    },
                    initialValue: 'Initial value',
                    proposedValue: 'Proposed value',
                    kind: 'Kind',
                    authorName: 'Author name',
                    comment: 'The Comment',
                },
            }),
        ).toStrictEqual({
            subject: 'An annotation has been added on « tenant »',
            text: `An annotation has been added on « tenant »
Resource: Resource title
Type : Kind
Initial value: Initial value
Proposed value: Proposed value
Contributor: Author name
Contributor comment: The Comment
See annotation: http://localhost:3000/instance/tenant/admin#/annotations`,
        });
    });

    it('should omit initial value when it is not set', () => {
        expect(
            getAnnotationNotificationMail({
                locale: 'en',
                tenant: 'tenant',
                origin: 'http://localhost:3000',
                annotationWithDetails: {
                    resource: {
                        title: 'Resource title',
                    },
                    field: {
                        label: 'Field label',
                    },
                    proposedValue: 'Proposed value',
                    kind: 'Kind',
                    authorName: 'Author name',
                    comment: 'The Comment',
                },
            }),
        ).toStrictEqual({
            subject: 'An annotation has been added on « tenant »',
            text: `An annotation has been added on « tenant »
Resource: Resource title
Type : Kind
Field: Field label
Proposed value: Proposed value
Contributor: Author name
Contributor comment: The Comment
See annotation: http://localhost:3000/instance/tenant/admin#/annotations`,
        });
    });

    it('should omit proposed value when it is not set', () => {
        expect(
            getAnnotationNotificationMail({
                locale: 'en',
                tenant: 'tenant',
                origin: 'http://localhost:3000',
                annotationWithDetails: {
                    resource: {
                        title: 'Resource title',
                    },
                    field: {
                        label: 'Field label',
                    },
                    initialValue: 'Initial value',
                    kind: 'Kind',
                    authorName: 'Author name',
                    comment: 'The Comment',
                },
            }),
        ).toStrictEqual({
            subject: 'An annotation has been added on « tenant »',
            text: `An annotation has been added on « tenant »
Resource: Resource title
Type : Kind
Field: Field label
Initial value: Initial value
Contributor: Author name
Contributor comment: The Comment
See annotation: http://localhost:3000/instance/tenant/admin#/annotations`,
        });
    });
});
