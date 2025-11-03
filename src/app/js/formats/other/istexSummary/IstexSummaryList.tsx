import memoize from 'lodash/memoize';

import { PropositionStatus } from '@lodex/common';
import { getSiteUrl } from '../../utils/fetchIstexData';
import type { Field } from '@lodex/frontend-common/fields/types';

const styles = {
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration:
            status === PropositionStatus.REJECTED ? 'line-through' : 'none',
    })),
};

interface IstexSummaryListProps {
    fieldStatus?: string;
    resource: object;
    field: Field;
}

const IstexSummaryList = ({
    fieldStatus,
    field,
    resource,
}: IstexSummaryListProps) => {
    // @ts-expect-error TS7053
    const url = getSiteUrl(resource[field.name]);

    return (
        <a
            style={styles.text(fieldStatus)}
            href={`${url}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {url}
        </a>
    );
};

export default IstexSummaryList;
