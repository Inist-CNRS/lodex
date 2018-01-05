import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui/Table';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import { changePosition, preLoadPublication } from '../';
import AddCharacteristic from '../addCharacteristic/AddCharacteristic';
import OntologyFieldList from './OntologyFieldList';

export class OntologyComponent extends Component {
    componentWillMount() {
        this.props.preLoadPublication();
    }

    onSortEnd = ({ oldIndex, newIndex }, _, fields, handleChangePosition) => {
        handleChangePosition({ newPosition: newIndex, oldPosition: oldIndex });
    };

    render() {
        const { fields, handleChangePosition, p: polyglot } = this.props;
        return (
            <Card>
                <CardHeader title={<h3>{polyglot.t('model')}</h3>} />
                <Divider />
                <CardText>
                    <Table>
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                        >
                            <TableRow>
                                <TableHeaderColumn />
                                <TableHeaderColumn>
                                    {polyglot.t('identifier')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('label')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('overview')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('cover')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('scheme')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('count_of_field')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('language')}
                                </TableHeaderColumn>
                                <TableHeaderColumn>
                                    {polyglot.t('edit')}
                                </TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <OntologyFieldList
                            lockAxis="y"
                            useDragHandle
                            items={fields}
                            onSortEnd={(oldIndex, newIndex) =>
                                this.onSortEnd(
                                    oldIndex,
                                    newIndex,
                                    fields,
                                    handleChangePosition,
                                )
                            }
                        />
                    </Table>
                </CardText>
                <CardActions>
                    <AddCharacteristic />
                </CardActions>
            </Card>
        );
    }
}

OntologyComponent.propTypes = {
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    handleChangePosition: PropTypes.func.isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    fields: fromFields.getFields(state),
});

const mapDispatchToProps = {
    changePositionAction: changePosition,
    preLoadPublication,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleChangePosition: ({ changePositionAction }) => field => {
            changePositionAction(field);
        },
    }),
    translate,
)(OntologyComponent);
