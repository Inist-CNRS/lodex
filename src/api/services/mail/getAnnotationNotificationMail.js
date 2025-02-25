import translations from '../translations';
import Polyglot from 'node-polyglot';

export const getAnnotationNotificationMail = ({
    locale = 'en',
    tenant,
    annotationWithDetails,
    origin,
}) => {
    const phrases = translations.getByLanguage(locale);

    const polyglot = new Polyglot({
        locale,
        phrases,
    });
    const subject = polyglot.t('notification_new_annotation_email_subject', {
        tenant: tenant,
    });

    const text = [
        subject,
        annotationWithDetails.resource
            ? polyglot.t('notification_new_annotation_email_resource', {
                  resource: annotationWithDetails.resource.title,
              })
            : null,
        polyglot.t('notification_new_annotation_email_type', {
            type: annotationWithDetails.kind,
        }),
        annotationWithDetails.field
            ? polyglot.t('notification_new_annotation_email_field', {
                  field: annotationWithDetails.field.label,
              })
            : null,
        annotationWithDetails.initialValue
            ? polyglot.t('notification_new_annotation_email_initial_value', {
                  initialValue: annotationWithDetails.initialValue,
              })
            : null,
        annotationWithDetails.proposedValue
            ? polyglot.t('notification_new_annotation_email_proposed_value', {
                  proposedValue: annotationWithDetails.proposedValue,
              })
            : null,
        polyglot.t('notification_new_annotation_email_author', {
            authorName: annotationWithDetails.authorName,
        }),
        polyglot.t('notification_new_annotation_email_comment', {
            comment: annotationWithDetails.comment,
        }),
        polyglot.t('notification_new_annotation_email_see_annotation', {
            annotationUrl: `${origin}/instance/${tenant}/admin#/annotations`,
        }),
    ]
        .filter(Boolean)
        .join('\n');

    return {
        subject,
        text: text,
    };
};
