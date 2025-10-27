import { type Field } from '../../../propTypes';
import Link from '../../../lib/components/Link';

interface LinkViewProps {
    className?: string;
    field: Field;
    fields: Field[];
    linkedResource?: object;
    resource: object;
    type: string;
    value: string;
    maxHeight: number;
}

const LinkView = ({ className, resource, field, value }: LinkViewProps) => {
    const imageURL = value;
    // @ts-expect-error TS7053
    const link = resource[field.name];
    const style = {};

    // @ts-expect-error TS18046
    if (field.format.args.maxHeight) {
        // @ts-expect-error TS2339
        style.maxHeight = field.format.args.maxHeight + 'px';
    }

    return (
        <Link className={className} href={`${link}`}>
            <img src={imageURL} style={style} />
        </Link>
    );
};

export default LinkView;
