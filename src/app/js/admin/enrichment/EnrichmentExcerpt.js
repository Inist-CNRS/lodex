import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { connect } from 'react-redux';
import {
    CircularProgress,
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

export const EnrichmentExcerptComponent = ({ lines, loading, p: polyglot }) => (
    <TableContainer component={Paper} style={{ height: EXCERPT_HEIGHT }}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell>{polyglot.t('sourcePreview')}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {!loading &&
                    lines.map(line => {
                        const stringifyLine = JSON.stringify(line);
                        return (
                            <TableRow key={stringifyLine}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    title={stringifyLine}
                                >
                                    {isLongText(stringifyLine)
                                        ? getShortText(stringifyLine)
                                        : stringifyLine}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                {loading && (
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <CircularProgress
                                variant="indeterminate"
                                size={20}
                            />
                        </TableCell>
                    </TableRow>
                )}
                {!loading && lines.length === 0 && (
                    <TableRow>
                        <TableCell component="th" scope="row">
                            Pas de données
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

EnrichmentExcerptComponent.propTypes = {
    lines: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentExcerptComponent);
