import { connect } from 'react-redux';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';

import { fromFields } from '../../sharedSelectors';
import { changeFieldStatus } from '../resource';
import Property from './';

const styles = {
    container: {
        paddingLeft: '2rem',
        marginLeft: '2rem',
        borderLeft: '1px dotted rgb(224, 224, 224)',
    },
};

interface PropertyLinkedFieldsComponentProps {
    fieldName: string;
    linkedFields: {
        _id: string;
    }[];
    parents: string[];
    resource: Record<string, unknown>;
}

const PropertyLinkedFieldsComponent = ({
    fieldName,

    linkedFields,

    parents,

    resource,
}: PropertyLinkedFieldsComponentProps) => {
    if (!linkedFields.length) {
        return null;
    }
    return (
        <div className="linked_fields" style={styles.container}>
            {linkedFields.map((linkedField) => (
                <Property
                    key={linkedField._id}
                    className={classnames(
                        'completes',
                        `completes_${fieldName}`,
                    )}
                    // @ts-expect-error TS2322
                    field={linkedField}
                    isSub
                    resource={resource}
                    parents={parents}
                />
            ))}
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { fieldName, parents = [] }) => {
    const allLinkedFields = fromFields.getLinkedFields(state, fieldName);
    const linkedFields = allLinkedFields.filter(
        // @ts-expect-error TS7006
        (f) => !parents.includes(f.name),
    );

    return { linkedFields };
};

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch, { field, resource: { uri } }) =>
    bindActionCreators(
        {
            changeStatus: (prevStatus, status) =>
                changeFieldStatus({
                    uri,
                    field: field.name,
                    status,
                    prevStatus,
                }),
        },
        dispatch,
    );

const PropertyLinkedFields = connect(
    mapStateToProps,
    // @ts-expect-error TS2769
    mapDispatchToProps,
)(PropertyLinkedFieldsComponent);

export default PropertyLinkedFields;
