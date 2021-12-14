import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { connect } from 'react-redux';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { isLongText, getShortText } from '../../lib/longTexts';

const EXCERPT_HEIGHT = 350;

export const EnrichmentExcerptComponent = ({ lines, p: polyglot }) => (
    <TableContainer component={Paper} style={{ height: EXCERPT_HEIGHT }}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell>{polyglot.t('sourcePreview')}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {lines.map(line => (
                    <TableRow key={line}>
                        <TableCell component="th" scope="row" title={line}>
                            {isLongText(line) ? getShortText(line) : line}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

EnrichmentExcerptComponent.propTypes = {
    lines: PropTypes.array.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentExcerptComponent);
