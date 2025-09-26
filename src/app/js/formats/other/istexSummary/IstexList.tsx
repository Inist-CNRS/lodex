import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { getMoreDocumentData } from './getIstexData';
import ButtonWithStatus from '../../../lib/components/ButtonWithStatus';
import stylesToClassname from '../../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        li: {
            listStyleType: 'none',
        },
        loadMore: {
            marginTop: '1rem',
        },
        skip: {
            paddingLeft: 0,
        },
    },
    'istex-list',
);

class IstexList extends Component {
    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
        this.state = {
            // @ts-expect-error TS2339
            ...this.props.data,
            isLoading: false,
        };
    }

    loadMore = () => {
        this.setState({ isLoading: true }, () =>
            // @ts-expect-error TS2339
            getMoreDocumentData(this.state.nextPageURI).then(
                ({ hits, total, nextPageURI }) =>
                    this.setState((state) => ({
                        ...state,
                        // @ts-expect-error TS2339
                        hits: state.hits.concat(hits),
                        total,
                        nextPageURI,
                        isLoading: false,
                    })),
            ),
        );
    };

    render() {
        // @ts-expect-error TS2339
        const { children, polyglot, data, skip, ...props } = this.props;
        // @ts-expect-error TS2339
        const { hits, total, nextPageURI, isLoading } = this.state;

        if (!hits || !hits.length) {
            return (
                <ul>
                    {/*
                     // @ts-expect-error TS2339 */}
                    <li className={styles.li}>
                        {polyglot.t('istex_no_result')}
                    </li>
                </ul>
            );
        }

        return (
            <div>
                {/*
                 // @ts-expect-error TS2339 */}
                <ul className={classnames({ skip }, skip && styles.skip)}>
                    {/*
                     // @ts-expect-error TS7006 */}
                    {hits.map((item, index) => (
                        // @ts-expect-error TS2339
                        <li className={styles.li} key={index}>
                            {/*
                             // @ts-expect-error TS2349 */}
                            {children({ ...props, polyglot, item })}
                        </li>
                    ))}
                </ul>
                {nextPageURI && (
                    // @ts-expect-error TS2339
                    <div className={classnames('load-more', styles.loadMore)}>
                        {/*
                         // @ts-expect-error TS2740 */}
                        <ButtonWithStatus
                            fullWidth
                            onClick={this.loadMore}
                            loading={isLoading}
                        >
                            {polyglot.t('search_load_more')} (
                            {total - hits.length})
                        </ButtonWithStatus>
                    </div>
                )}
            </div>
        );
    }
}

// @ts-expect-error TS2339
IstexList.propTypes = {
    data: PropTypes.shape({
        hits: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired,
        nextPageURI: PropTypes.string,
    }).isRequired,
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    skip: PropTypes.bool.isRequired,
};

export default IstexList;
