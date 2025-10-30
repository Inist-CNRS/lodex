import { connect } from 'react-redux';
import camelCase from 'lodash/camelCase';
import { fromFields } from '../../../../src/app/js/sharedSelectors';
import Property from './index';
import getFieldClassName from '@lodex/frontend-common/utils/getFieldClassName';

const styles = {
    container: {
        display: 'flex',
        flexFlow: 'row wrap',
    },
    property: {
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
    },
};

interface CompositePropertyComponentProps {
    field: unknown;
    compositeFields: {
        name: string;
    }[];
    parents: string[];
    resource: Record<string, unknown>;
}

export const CompositePropertyComponent = ({
    compositeFields,

    field,

    parents,

    resource,
}: CompositePropertyComponentProps) => {
    if (!compositeFields.length) {
        return null;
    }

    return (
        <div style={styles.container}>
            {compositeFields.map((f) => (
                <Property
                    // @ts-expect-error TS2322
                    className={`compose_${getFieldClassName(field)} ${camelCase(f.internalName || '')}`}
                    key={f.name}
                    // @ts-expect-error TS2322
                    field={f}
                    isSub
                    parents={parents}
                    resource={resource}
                    style={styles.property}
                />
            ))}
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { field, resource, parents }) => {
    const allCompositeFields = fromFields.getCompositeFieldsByField(
        state,
        field,
    );

    const compositeFields = allCompositeFields?.filter(
        // @ts-expect-error TS7006
        (f) => f?.name && !parents.includes(f.name),
    );

    return {
        resource,
        compositeFields,
    };
};

const CompositeProperty = connect(mapStateToProps)(CompositePropertyComponent);

export default CompositeProperty;
