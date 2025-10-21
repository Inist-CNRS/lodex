import memoize from 'lodash/memoize';

import { REJECTED } from '../../../../../common/propositionStatus';
import { type Field } from '../../../propTypes';
import { ISTEX_API_URL } from '../../../../../common/externals';
import Link from '../../../lib/components/Link';

const styles = {
    text: memoize((status) =>
        Object.assign({
            fontSize: '1rem',
            textDecoration: status === REJECTED ? 'line-through' : 'none',
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
