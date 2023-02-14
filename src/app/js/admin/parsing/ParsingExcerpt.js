import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { Table, TableBody, TableHead, TableRow } from '@mui/material';

import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import { fromEnrichments, fromParsing, fromSubresources } from '../selectors';
import colorsTheme from '../../../custom/colorsTheme';
import { IN_PROGRESS } from '../../../../common/enrichmentStatus';
import { addField } from '../../fields';
import { useParams } from 'react-router';
import parseValue from '../../../../common/tools/parseValue';

export const getRowStyle = (index, total) => {
    let opacity = 1;

    if (total > 2 && index === total - 2) {
        opacity = 0.45;
    }

    if (total > 2 && index === total - 1) {
        opacity = 0.25;
    }

    return { opacity, height: 36 };
};

export const getEnrichmentsNames = enrichments => {
    return enrichments?.map(enrichiment => enrichiment.name);
};

export const getColumnStyle = (enrichmentsNames, column) => {
    return enrichmentsNames?.includes(column)
        ? {
              backgroundColor: colorsTheme.green.light,
          }
        : {};
};

const formatValue = value => {
    return JSON.stringify(value);
};

export const ParsingExcerptComponent = ({
    columns,
    handleAddColumn,
    lines,
    showAddFromColumn,
    onAddField,
    enrichments,
    maxLines,
    subresources,
}) => {
    const enrichmentsNames = useMemo(() => getEnrichmentsNames(enrichments), [
        enrichments,
    ]);

    const { filter, subresourceId } = useParams();

    const subresource = subresources.find(
        subresource => subresource._id === subresourceId,
    );

    const subresourceData = parseValue(lines[0][subresource?.path] || '');

    const displayedLines = subresourceId
        ? lines
              .map(line => parseValue(line[subresource?.path]))
              .slice(0, maxLines)
        : lines.slice(0, maxLines);

    const displayedColumns = subresourceId
        ? [
              ...Object.keys(
                  (Array.isArray(subresourceData)
                      ? subresourceData[0]
                      : subresourceData) || {},
              ),
          ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        : columns;

    const checkIsEnrichmentLoading = column => {
        return (
            enrichments?.find(enrichiment => enrichiment.name === column)
                ?.status === IN_PROGRESS
        );
    };

    const total = displayedLines.length;
    return (
        <Table
            sx={{
                display: 'block',
                overflowX: 'auto',
                width: 'auto',
                minWidth: '100%',
                border: '4px solid rgb(95, 99, 104, 0.1)',
            }}
        >
            <TableHead>
                <TableRow>
                    {displayedColumns.map(column => (
                        <ParsingExcerptHeaderColumn
                            key={`header_${column}`}
                            column={column}
                            sx={getColumnStyle(enrichmentsNames, column)}
                        />
                    ))}
                </TableRow>
            </TableHead>
            <TableBody
                sx={{
                    position: 'relative',
                }}
            >
                {displayedLines.map((line, index) => (
                    <TableRow
                        key={`${line._id || index}_data_row`}
                        style={getRowStyle(index, total)}
                    >
                        {displayedColumns.map(column => {
                            const showAddColumnButton =
                                showAddFromColumn &&
                                (index === total - 3 ||
                                    (total < 3 && index === 0));

                            return (
                                <ParsingExcerptColumn
                                    key={`${column}_${line._id || index}`}
                                    value={formatValue(
                                        Array.isArray(line)
                                            ? line.map(
                                                  lineItem => lineItem[column],
                                              )
                                            : line[column],
                                    )}
                                    sx={getColumnStyle(
                                        enrichmentsNames,
                                        column,
                                    )}
                                    isEnrichmentLoading={checkIsEnrichmentLoading(
                                        column,
                                    )}
                                >
                                    {showAddColumnButton && (
                                        <ParsingExcerptAddColumn
                                            key={`add_column_${column}`}
                                            name={column}
                                            onAddColumn={name => {
                                                onAddField && onAddField();
                                                handleAddColumn({
                                                    name,
                                                    scope: filter,
                                                    subresourceId,
                                                    subresource,
                                                });
                                            }}
                                            atTop={total < 3}
                                        />
                                    )}
                                </ParsingExcerptColumn>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

ParsingExcerptComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    enrichments: PropTypes.arrayOf(PropTypes.object),
    handleAddColumn: PropTypes.func.isRequired,
    showAddFromColumn: PropTypes.bool.isRequired,
    onAddField: PropTypes.func,
    maxLines: PropTypes.number,
    subresources: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ParsingExcerptComponent.defaultProps = {
    maxLines: 6,
};

const mapStateToProps = state => ({
    enrichments: fromEnrichments.enrichments(state),
    columns: fromParsing.getParsedExcerptColumns(state),
    lines: fromParsing.getExcerptLines(state),
    subresources: fromSubresources.getSubresources(state),
});

const mapDispatchToProps = {
    handleAddColumn: addField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    pure,
)(ParsingExcerptComponent);
