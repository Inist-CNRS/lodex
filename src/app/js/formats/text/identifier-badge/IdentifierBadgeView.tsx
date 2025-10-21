import { type Field } from '../../../propTypes';
import { resolvers } from './index';
import Link from '../../../lib/components/Link';
import stylesToClassname from '../../../lib/stylesToClassName';

// @ts-expect-error TS2554
const styles = stylesToClassname({
    key: {
        float: 'left',
        margin: '0',
        padding: '2px 7px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontWeight: '300',
        fontSize: '14px',
        textShadow: '0.5px 0.5px rgba(10, 10, 10, 0.4)',
        background:
            'linear-gradient(to bottom, rgba(63, 76, 107, 0.01) 0%, rgba(18, 19, 30, 0.5) 100%)',
        backgroundColor: '#555',
        borderRadius: '5px 0 0 5px',
    },
    value: {
        float: 'left',
        margin: '0',
        padding: '2px 7px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontWeight: '300',
        fontSize: '14px',
        background:
            'linear-gradient(to bottom, rgba(63, 76, 107, 0.01) 50%, rgba(18, 19, 30, 0.2) 100%)',
        textShadow: '0.5px 0.5px rgba(10, 10, 10, 0.4)',
        borderRadius: '0 5px 5px 0',
    },
});

interface IdentifierBadgeViewProps {
    field: Field;
    typid: string;
    colors: string;
    resource: object;
}

const IdentifierBadgeView = ({
    resource,
    field,
    typid,
    colors,
}: IdentifierBadgeViewProps) => {
    // @ts-expect-error TS7053
    const resolver = resolvers[typid] || '';
    // @ts-expect-error TS7053
    const value = resource[field.name] || '';

    const identifier = value.replace(resolver, '');
    const target = resolver + identifier;
    const colorStyle = {
        backgroundColor: colors.split(' ')[0],
    };

    if ((identifier || '').trim() === '') {
        return null;
    }

    return (
        <Link href={target}>
            {/*
             // @ts-expect-error TS2339 */}
            <span className={styles.key}>{typid}</span>
            {/*
             // @ts-expect-error TS2339 */}
            <span className={styles.value} style={colorStyle}>
                {identifier}
            </span>
        </Link>
    );
};

export default IdentifierBadgeView;
