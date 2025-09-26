// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FileDownload from '@mui/icons-material/GetApp';
import Link from '../../../lib/components/Link';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import { getMoreDocumentData } from '../istexSummary/getIstexData';
import ButtonWithStatus from '../../../lib/components/ButtonWithStatus';
import stylesToClassname from '../../../lib/stylesToClassName';
import { HOST_TITLE_RAW } from '../istexSummary/constants';
import { ISTEX_SITE_URL } from '../../../../../common/externals';

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

class IstexCitationList extends Component {
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
        const { children, polyglot, data, skip, value, name, ...props } =
            this.props;
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
                {total > 0 && (
                    <div
                        style={{
                            borderBottom: '1px solid lightgrey',
                            marginBottom: '1rem',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                color: 'rgba(0,0,0,0.54)',
                            }}
                        >
                            {polyglot.t('istex_total', {
                                total,
                            })}
                        </span>
                        {/*
                         // @ts-expect-error TS2739 */}
                        <Link
                            style={{
                                float: 'right',
                            }}
                            href={`${ISTEX_SITE_URL}/?q=`.concat(
                                encodeURIComponent(
                                    `(${value}) AND ${HOST_TITLE_RAW}:"${name}"`,
                                ),
                            )}
                            target="_blank"
                        >
                            {/*
                             // @ts-expect-error TS2769 */}
                            <FileDownload tooltip={polyglot.t('download')} />
                        </Link>
                    </div>
                )}
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
IstexCitationList.propTypes = {
    data: PropTypes.shape({
        hits: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired,
        nextPageURI: PropTypes.string,
    }).isRequired,
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    skip: PropTypes.bool.isRequired,
    name: PropTypes.string,
    value: PropTypes.string,
};

export default IstexCitationList;
