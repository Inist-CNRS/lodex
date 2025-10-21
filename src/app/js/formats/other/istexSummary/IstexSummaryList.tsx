import memoize from 'lodash/memoize';

import { REJECTED } from '../../../../../common/propositionStatus';
import { type Field } from '../../../propTypes';
import { getSiteUrl } from '../../utils/fetchIstexData';

const styles = {
    text: memoize((status) => ({
        fontSize: '1rem',
        textDecoration: status === REJECTED ? 'line-through' : 'none',
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

IstexSummaryList.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    data: null,
    error: null,
};

export default IstexSummaryList;
