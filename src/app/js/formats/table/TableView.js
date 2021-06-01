import React, { Component } from 'react';
import compose from 'recompose/compose';
import injectData from '../injectData';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import PropTypes from 'prop-types';
import stylesToClassname from '../../lib/stylesToClassName';
import { getResourceUri, isLocalURL } from '../../../../common/uris';
import Link from '../../lib/components/Link';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

const styles = stylesToClassname(
    {
        elementExpectFirst: {
            color: '#A1A1A4',
        },
    },
    'table',
);

class TableView extends Component {
    static propTypes = {
        field: fieldPropTypes.isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        total: PropTypes.number.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        const link = (id, url) => {
            if (isLocalURL(id))
                return <Link to={getResourceUri({ uri: id })}>{url}</Link>;
            else return <Link to={url}>{url}</Link>;
        };

        return (
            <Table>
                <TableBody>
                    {data.map((entry, index) => (
                        <TableRow key={`${index}-table`}>
                            <TableCell>{entry.title}</TableCell>
                            <TableCell className={styles.elementExpectFirst}>
                                {link(entry.id, entry.url)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

const mapStateToProps = (_, { formatData, spaceWidth }) => {
    if (!formatData || !formatData.items) {
        return {
            data: [],
            total: 0,
        };
    }

    return {
        data: formatData.items,
        total: formatData.total,
        spaceWidth,
    };
};

export default compose(
    injectData(null, field => !!field),
    connect(mapStateToProps),
    translate,
)(TableView);
