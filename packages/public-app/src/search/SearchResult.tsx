import { memo, type CSSProperties } from 'react';
import classnames from 'classnames';

import { isURL, getResourceUri } from '@lodex/common';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import ExpandableResourceCard, {
    ellipsis,
    expandedSx,
} from '@lodex/frontend-common/formats/utils/components/ExpandableResourceCard';
import { Box } from '@mui/material';
import { useIsVisited } from '../resource/useRememberVisit';

const styles: Record<string, CSSProperties> = stylesToClassname(
    {
        details: {
            display: 'flex',
            flex: '0 0 auto',
            fontSize: 'smaller',
            color: '#555',
        },
        detailsColumn: {
            flex: '1 0 0',
            paddingRight: '1rem',
        },
    },
    'search-result',
);

type SearchResultProps = {
    fields: { name: string }[];
    fieldNames: {
        title?: string;
        description?: string;
        detail1?: string;
        detail2?: string;
        detail3?: string;
    };
    result: { uri: string; [key: string]: any };
    closeDrawer(): void;
};

const SearchResult = ({
    fields,
    fieldNames,
    result,
    closeDrawer,
}: SearchResultProps) => {
    const isVisited = useIsVisited(result);
    const titleField = fields.find((field) => field.name === fieldNames.title);
    const descriptionField = fields.find(
        (field) => field.name === fieldNames.description,
    );
    const firstDetailField = fields.find(
        (field) => field.name === fieldNames.detail1,
    );
    const secondDetailField = fields.find(
        (field) => field.name === fieldNames.detail2,
    );

    const thirdDetailField = fields.find(
        (field) => field.name === fieldNames.detail3,
    );

    const shouldDisplayDetails =
        (firstDetailField && result[firstDetailField.name]) ||
        (secondDetailField && result[secondDetailField.name]);

    const linkProps = isURL(result.uri)
        ? { href: result.uri }
        : { to: getResourceUri(result) };
    return (
        <ExpandableResourceCard
            {...linkProps}
            routeAware
            visited={isVisited}
            onClick={closeDrawer}
            domId={`search-result-${result.uri}`}
            title={titleField && result[titleField.name]}
            description={descriptionField && result[descriptionField.name]}
            beforeDescription={
                thirdDetailField &&
                result[thirdDetailField.name] && (
                    <div
                        className={classnames(
                            'search-result-detail-third',
                            styles.details,
                        )}
                    >
                        <div
                            className={classnames(
                                'search-result-detail-3',
                                styles.detailsColumn,
                            )}
                            title={result[thirdDetailField.name]}
                        >
                            {result[thirdDetailField.name]}
                        </div>
                    </div>
                )
            }
            afterDescription={(expanded) =>
                shouldDisplayDetails && (
                    <div
                        className={classnames(
                            'search-result-details',
                            styles.details,
                        )}
                    >
                        {firstDetailField && result[firstDetailField.name] && (
                            <Box
                                className={classnames(
                                    'search-result-detail1',
                                    styles.detailsColumn,
                                )}
                                title={result[firstDetailField.name]}
                                sx={expanded ? expandedSx : ellipsis}
                            >
                                {result[firstDetailField.name]}
                            </Box>
                        )}
                        {secondDetailField &&
                            result[secondDetailField.name] && (
                                <Box
                                    className={classnames(
                                        'search-result-detail2',
                                        styles.detailsColumn,
                                    )}
                                    title={result[secondDetailField.name]}
                                    sx={expanded ? expandedSx : ellipsis}
                                >
                                    {result[secondDetailField.name]}
                                </Box>
                            )}
                    </div>
                )
            }
        />
    );
};

export default memo(
    SearchResult,
    (prevProps, nextProps) => prevProps.result.uri === nextProps.result.uri,
);
