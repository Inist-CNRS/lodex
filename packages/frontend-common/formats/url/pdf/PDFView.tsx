import classnames from 'classnames';

import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import type { Field } from '@lodex/frontend-common/fields/types';

const styles = stylesToClassname(
    {
        container: {
            padding: 0,
            border: '5px solid rgba(0,0,0,.1)',
            minHeight: '45vw',
        },
    },
    'pdf',
);

interface PDFViewProps {
    field: Field;
    resource: object;
    PDFWidth: string;
}

const PDFView = ({ resource, field, PDFWidth }: PDFViewProps) => {
    // @ts-expect-error TS7053
    const PDFURL = resource[field.name];

    return (
        <iframe
            title="PDF Viewer"
            // @ts-expect-error TS2339
            className={classnames('pdf-container', styles.container)}
            width={PDFWidth}
            src={PDFURL}
            allow="fullscreen"
            // @ts-expect-error TS2322
            webkitallowfullscreen=""
        ></iframe>
    );
};

export default PDFView;
