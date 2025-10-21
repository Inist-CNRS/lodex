import { useMemo } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    type SxProps,
} from '@mui/material';

import ParsingExcerptColumn from './ParsingExcerptColumn';
import ParsingExcerptHeaderColumn from './ParsingExcerptHeaderColumn';
import ParsingExcerptAddColumn from './ParsingExcerptAddColumn';
import { fromEnrichments, fromParsing, fromSubresources } from '../selectors';
import { IN_PROGRESS } from '../../../../common/taskStatus';
import { addField } from '../../fields';
import { useParams } from 'react-router';
import parseValue from '../../../../common/tools/parseValue';

// @ts-expect-error TS7006
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

// @ts-expect-error TS7006
export const getEnrichmentsNames = (enrichments) => {
    // @ts-expect-error TS7006
    return enrichments?.map((enrichiment) => enrichiment.name);
};

// @ts-expect-error TS7006
export const getColumnStyle = (enrichmentsNames, column): SxProps => {
    return enrichmentsNames?.includes(column)
        ? {
              backgroundColor: 'var(--primary-light)',
          }
        : {};
};

// @ts-expect-error TS7006
const formatValue = (value) => {
    return JSON.stringify(value);
};

interface ParsingExcerptComponentProps {
    columns: string[];
    lines: {
        uri: string;
        [key: string]:
            | string
            | {
                  path?: string;
              };
    }[];
    enrichments?: {
        status: string;
    }[];
    handleAddColumn(column: {
        name: string;
        scope?: string;
        subresourceId?: string;
        subresourcePath?: string;
    }): void;
    showAddFromColumn: boolean;
    onAddField?(): void;
    maxLines?: number;
    subresources: {
        path: string;
    }[];
}

export const ParsingExcerptComponent = ({
    columns,
    handleAddColumn,
    lines,
    showAddFromColumn,
    onAddField,
    enrichments,
    maxLines,
    subresources,
}: ParsingExcerptComponentProps) => {
    const enrichmentsNames = useMemo(
        () => getEnrichmentsNames(enrichments),
        [enrichments],
    );

    // @ts-expect-error TS2339
    const { filter, subresourceId } = useParams();

    const subresource = subresources.find(
        // @ts-expect-error TS7006
        (subresource) => subresource._id === subresourceId,
    );

    const subresourceData = parseValue(
        lines[0][subresource?.path as string] || '',
    );

    const displayedLines = subresourceId
        ? lines
              // @ts-expect-error TS7006
              .map((line) => parseValue(line[subresource?.path]))
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

    // @ts-expect-error TS7006
    const checkIsEnrichmentLoading = (column) => {
        return (
            // @ts-expect-error TS7006
            enrichments?.find((enrichiment) => enrichiment.name === column)
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
                    {displayedColumns.map((column) => (
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
                        {displayedColumns.map((column) => {
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
                                                  (lineItem) =>
                                                      lineItem[column],
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
                                            // @ts-expect-error TS2322
                                            name={column}
                                            // @ts-expect-error TS7006
                                            onAddColumn={(name) => {
                                                if (onAddField) {
                                                    onAddField();
                                                }
                                                handleAddColumn({
                                                    name,
                                                    scope: filter,
                                                    subresourceId,
                                                    subresourcePath:
                                                        subresource?.path,
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

ParsingExcerptComponent.defaultProps = {
    maxLines: 6,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
    // @ts-expect-error TS2345
)(ParsingExcerptComponent);
