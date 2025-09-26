import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { translate } from '../../../i18n/I18NContext';
import { Button, CircularProgress } from '@mui/material';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';

import LodexResource from '../../utils/components/LodexResource';
import injectData from '../../injectData';
import stylesToClassname from '../../../lib/stylesToClassName';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../../propTypes';

// @ts-expect-error TS7006
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

class ResourcesGridView extends Component {
    static propTypes = {
        field: fieldPropTypes.isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        total: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        titleSize: PropTypes.number.isRequired,
        summarySize: PropTypes.number.isRequired,
        openInNewTab: PropTypes.bool.isRequired,
        spaceWidth: PropTypes.string.isRequired,
        filterFormatData: PropTypes.func.isRequired,
        allowToLoadMore: PropTypes.bool.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.state = {
            fetch: false,
            more: props.pageSize,
        };
    }

    handleMore = () => {
        // @ts-expect-error TS2339
        const { filterFormatData, pageSize } = this.props;

        this.setState(
            // @ts-expect-error TS2339
            (prevState) => ({ more: prevState.more + pageSize }),
            // @ts-expect-error TS2339
            () => filterFormatData({ maxSize: this.state.more }),
        );
    };

    render() {
        const {
            // @ts-expect-error TS2339
            data,
            // @ts-expect-error TS2339
            spaceWidth,
            // @ts-expect-error TS2339
            total,
            // @ts-expect-error TS2339
            allowToLoadMore,
            // @ts-expect-error TS2339
            p: polyglot,
        } = this.props;
        // @ts-expect-error TS2339
        const { more, fetch } = this.state;
        const styles = createStyles(spaceWidth);

        const filteredData = allowToLoadMore ? data.slice(0, more) : data;

        return (
            <div>
                <ul className={styles.list}>
                    {/*
                     // @ts-expect-error TS7006 */}
                    {filteredData.map((entry, index) => (
                        <li
                            key={`${index}-resources-grid`}
                            className={styles.item}
                        >
                            <div className={styles.content}>
                                <LodexResource
                                    {...entry}
                                    // @ts-expect-error TS2339
                                    titleSize={this.props.titleSize}
                                    // @ts-expect-error TS2339
                                    summarySize={this.props.summarySize}
                                    // @ts-expect-error TS2339
                                    openInNewTab={this.props.openInNewTab}
                                    polyglot={polyglot}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
                {allowToLoadMore && more < total && (
                    <div className={styles.button}>
                        <Button
                            variant="contained"
                            onClick={this.handleMore}
                            startIcon={
                                fetch ? (
                                    <CircularProgress
                                        variant="indeterminate"
                                        size={20}
                                    />
                                ) : null
                            }
                        >
                            {polyglot.t('see_more_result')}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

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
    translate,
)(ResourcesGridView);
