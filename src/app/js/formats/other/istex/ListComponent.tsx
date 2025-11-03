import memoize from 'lodash/memoize';

import { PropositionStatus } from '@lodex/common';
import Link from '@lodex/frontend-common/components/Link.tsx';
import { ISTEX_API_URL } from '../../../api/externals.ts';
import type { Field } from '@lodex/frontend-common/fields/types.ts';

const styles = {
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration:
            status === PropositionStatus.REJECTED ? 'line-through' : 'none',
    })),
};

interface IstexViewProps {
    fieldStatus?: string;
    resource: Record<string, unknown>;
    field: Field;
}

const IstexView = ({ fieldStatus, field, resource }: IstexViewProps) => {
    const url = `${ISTEX_API_URL}/document/?q=${resource[field.name]}`;
    return (
        <Link style={styles.text(fieldStatus)} href={`${url}`}>
            {url}
        </Link>
    );
};

export default IstexView;
