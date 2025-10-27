import { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import memoize from 'lodash/memoize';

import LodexResource from '../../utils/components/LodexResource';
import injectData from '../../injectData';
import stylesToClassname from '../../../lib/stylesToClassName';
import { useTranslate } from '../../../i18n/I18NContext';

const createStyles = memoize((spaceWidth) =>
    stylesToClassname(
        {
            list: {
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0',
                padding: '0',
                listStyle: 'none',
            },
            item: {
                listStyle: 'none',
                display: 'flex',
                padding: '0.5em',
                width: '100%',
                borderRadius: '2px',
                background: 'white',
                boxShadow: '0 2px 1px rgba(170, 170, 170, 0.25)',
                '@media all and (min-width: 40em)': {
                    width: '50%',
                    margin: '0',
                },
                '@media all and (min-width: 60em)': {
                    width: `${spaceWidth}`,
                    margin: '1%',
                },
            },
            content: {
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                padding: '1em',
                width: '100%',
            },
        },
        'resources-grid',
    ),
);

interface ResourcesGridViewProps {
    field: unknown;
    data: object[];
    total: number;
    pageSize: number;
    titleSize: number;
    summarySize: number;
    openInNewTab: boolean;
    spaceWidth: string;
    filterFormatData(...args: unknown[]): unknown;
    allowToLoadMore: boolean;
}

const ResourcesGridView = ({
    field: _field,
    data,
    total,
    pageSize,
    titleSize,
    summarySize,
    openInNewTab,
    spaceWidth,
    filterFormatData,
    allowToLoadMore,
}: ResourcesGridViewProps) => {
    const { translate } = useTranslate();
    const [more, setMore] = useState(pageSize);

    const handleMore = () => {
        const newMore = more + pageSize;
        setMore(newMore);
        filterFormatData({ maxSize: newMore });
    };

    const styles = createStyles(spaceWidth);
    const filteredData = allowToLoadMore ? data.slice(0, more) : data;

    return (
        <div>
            {/* 
            // @ts-expect-error TS2322 */}
            <ul className={styles.list}>
                {filteredData.map((entry, index) => (
                    <li
                        key={`${index}-resources-grid`}
                        // @ts-expect-error TS2322
                        className={styles.item}
                    >
                        {/* 
                        // @ts-expect-error TS2322 */}
                        <div className={styles.content}>
                            <LodexResource
                                {...entry}
                                titleSize={titleSize}
                                summarySize={summarySize}
                                openInNewTab={openInNewTab}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            {allowToLoadMore && more < total && (
                // @ts-expect-error TS2322
                <div className={styles.button}>
                    <Button
                        variant="contained"
                        onClick={handleMore}
                        startIcon={null}
                    >
                        {translate('see_more_result')}
                    </Button>
                </div>
            )}
        </div>
    );
};

// @ts-expect-error TS7006
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
    // @ts-expect-error TS2345
    injectData(null, (field) => !!field),
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(ResourcesGridView);
