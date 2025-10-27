import classnames from 'classnames';

import stylesToClassname from '../../../lib/stylesToClassName';
import { type Field } from '../../../propTypes';
import { getViewComponent } from '../../index';

// @ts-expect-error TS7006
const styles = (bullet) =>
    stylesToClassname(
        {
            ordered: {
                listStyleType: 'decimal',
                marginLeft: '6px',
                marginBottom: '12px',
            },
            ordered_li: {
                marginBottom: '12px',
            },
            unordered: {
                listStyleType: bullet ? `"${bullet} "` : 'initial',
                marginBottom: '12px',
            },
            unordered_li: {
                marginBottom: '12px',
            },
            unordered_without_bullet: {
                listStyleType: 'none',
                marginBottom: '12px',
            },
            unordered_without_bullet_li: {
                marginBottom: '12px',
            },
            unordered_flat: {
                listStyleType: 'none',
            },
            unordered_flat_li: {
                display: 'inline-block',
                marginRight: '12px',
                ':after': {
                    content: bullet ? `" ${bullet} "` : '""',
                },
                ':last-child:after': {
                    content: '""',
                },
                ':last-child': {
                    marginRight: '0',
                },
            },
        },
        'list-format',
    );

interface ULProps {
    className?: string;
    children: any;
}

export const UL = ({ className, children }: ULProps) => (
    <ul className={className}>{children}</ul>
);

interface OLProps {
    className?: string;
    children: any;
}

export const OL = ({ className, children }: OLProps) => (
    <ol className={className}>{children}</ol>
);

interface ListViewProps {
    className?: string;
    field: Field;
    resource: object;
    type?: string;
    bullet?: string;
    subFormat?: string;
    subFormatOptions?: any;
}

const ListView = ({
    className,

    resource,

    field,

    type,

    bullet,

    subFormat,

    subFormatOptions,
}: ListViewProps) => {
    // @ts-expect-error TS7053
    const values = resource[field.name];
    if (values == null || values === '' || !Array.isArray(values)) {
        return null;
    }

    // @ts-expect-error TS2554
    const { ViewComponent, args } = getViewComponent(subFormat);

    const List = type === 'ordered' ? OL : UL;

    const localStyles = styles(bullet);

    return (
        // @ts-expect-error TS7053
        <List className={classnames(localStyles[type], className)}>
            {values.map((value, index) => (
                <li
                    key={value}
                    // @ts-expect-error TS7053
                    className={classnames(localStyles[`${type}_li`])}
                >
                    {subFormat ? (
                        <ViewComponent
                            resource={values}
                            field={{
                                ...field,
                                name: index.toString(),
                                valueOfList: value,
                                format: {
                                    name: subFormat,
                                    args: subFormatOptions,
                                },
                            }}
                            {...args}
                            {...subFormatOptions}
                        />
                    ) : (
                        value
                    )}
                </li>
            ))}
        </List>
    );
};

export default ListView;
