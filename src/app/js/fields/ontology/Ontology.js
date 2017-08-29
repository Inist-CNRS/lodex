import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import memoize from 'lodash.memoize';
import fetch from 'isomorphic-fetch';
import Reorder from 'material-ui/svg-icons/action/reorder';
import AppBar from 'material-ui/AppBar';
import { grey300, grey900 } from 'material-ui/styles/colors';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import { field as fieldPropTypes } from '../../propTypes';
import { fromUser, fromFields } from '../../sharedSelectors';
import OntologyField from './OntologyField';
import ExportFieldsButton from '../../public/export/ExportFieldsButton';
import { changePosition } from '../';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '3rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
    exportContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '3rem',
        marginBottom: '1rem',
    },
    handle: {
        width: '100%',
        height: '2.5em',
        backgroundColor: grey300,
        cursor: 'ns-resize',
        zIndex: 0,
    },
    handleIcon: {
        color: grey900,
        marginTop: '-1px',
    },
    icon: { color: 'black' },
};

const DragHandle = SortableHandle(() =>
    <AppBar
        style={styles.handle}
        iconElementLeft={
            <Reorder
                style={styles.handleIcon}
            />}
    />);

const SortableItem = SortableElement(({ value, sortIndex }) => (
    <div>
        { Boolean(sortIndex) && <DragHandle /> }
        {value}
    </div>));

const SortableList = SortableContainer(({ items }) => (
    <ul>
        {items.map((value, index) => (
            // eslint-disable-next-line
            <SortableItem disabled={index === 0} key={`item-${index}`} sortIndex={index} index={index} value={value} />
        ))}
    </ul>
    ));

export class OntologyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { fieldsToCount: [] };
    }

    componentDidMount() {
        const fieldsToCount = this.props.fields
            .filter(field => field.cover !== 'dataset')
            .map(field => 'field='.concat(field.name))
            .join('&');
        const apiURL = '/api/reduce/count?'.concat(fieldsToCount);
        fetch(apiURL)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const data = json.data.reduce((o, c) => {
                        const { _id, value } = c;
                        return { ...o, [_id]: value };
                    }, {});
                    this.setState({ fieldsToCount: data });
                });
            });
    }

    onSortEnd = ({ oldIndex, newIndex }, _, fields, handleChangePosition) => {
        handleChangePosition({ newPosition: newIndex, oldPosition: oldIndex });
    };

    render() {
        const { fields, isLoggedIn, handleChangePosition } = this.props;
        const { fieldsToCount } = this.state;
        return (
            <div className="ontology" style={styles.container}>
                {isLoggedIn &&
                    <div>
                        <div style={styles.exportContainer}>
                            <ExportFieldsButton iconStyle={styles.icon} />
                        </div>
                        {/* {<OntologyField
                            field={fields[0]}
                            index={0}
                            fieldsToCount={Array.isArray(fieldsToCount) ? {} : fieldsToCount}
                        />} */}
                        <SortableList
                            lockAxis="y"
                            useDragHandle
                            items={
                            fields.map((field, index) => (
                                <OntologyField
                                    field={field}
                                    index={index + 1}
                                    fieldsToCount={Array.isArray(fieldsToCount) ? {} : fieldsToCount}
                                />))}
                            onSortEnd={(oldIndex, newIndex) =>
                                       this.onSortEnd(oldIndex, newIndex, fields, handleChangePosition)}
                        />
                    </div>}
                {!isLoggedIn &&
                        fields.map((field, index) => (
                            <OntologyField
                                field={field}
                                index={index}
                                fieldsToCount={Array.isArray(fieldsToCount) ? {} : fieldsToCount}
                            />))}
            </div>
        );
    }
}

OntologyComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    handleChangePosition: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
    isLoggedIn: fromUser.isLoggedIn(state),
});

const mapDispatchToProps = {
    changePositionAction: changePosition,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChangePosition: ({ changePositionAction }) => (field) => {
            changePositionAction(field);
        },
    }),
    translate,
)(OntologyComponent);
