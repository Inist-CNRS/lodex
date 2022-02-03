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
import { HelpOutline as HelpOutlineIcon } from '@material-ui/icons';
import { isLongText, getShortText } from '../../lib/longTexts';
import { makeStyles } from '@material-ui/styles';

const EXCERPT_HEIGHT = 350;

const useStyle = makeStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

export const EnrichmentExcerptComponent = ({
    lines,
    loading,
    advancedMode,
    p: polyglot,
}) => {
    const classes = useStyle();
    return (
        <TableContainer component={Paper} style={{ height: EXCERPT_HEIGHT }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.header}>
                            <div>{polyglot.t('sourcePreview')}</div>
                            {advancedMode && (
                                <div
                                    title={polyglot.t(
                                        'advancedModePreviewInfo',
                                    )}
                                >
                                    <HelpOutlineIcon />
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!loading &&
                        lines.map((line, index) => {
                            const stringifyLine = JSON.stringify(line);
                            return (
                                <TableRow key={stringifyLine + index}>
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
                                {polyglot.t('completes_field_none')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

EnrichmentExcerptComponent.propTypes = {
    lines: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
    advancedMode: PropTypes.bool,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(EnrichmentExcerptComponent);
