import memoize from 'lodash/memoize';

import { PropositionStatus } from '@lodex/common';
import { ISTEX_API_URL } from '../../../api/externals';
import Link from '@lodex/frontend-common/components/Link';
import type { Field } from '../../../fields/types';

const styles = {
    text: memoize((status) =>
        Object.assign({
            fontSize: '1rem',
            textDecoration:
                status === PropositionStatus.REJECTED ? 'line-through' : 'none',
        }),
    ),
};

interface IstexRefbibsViewProps {
    fieldStatus?: string;
    resource: Record<string, unknown>;
    field: Field;
}

const IstexRefbibsView = ({
    fieldStatus,
    field,
    resource,
}: IstexRefbibsViewProps) => {
    const url = `${ISTEX_API_URL}/document/?q=${resource[field.name]}`;
    return (
        <Link style={styles.text(fieldStatus)} href={`${url}`}>
            {url}
        </Link>
    );
};

export default IstexRefbibsView;
