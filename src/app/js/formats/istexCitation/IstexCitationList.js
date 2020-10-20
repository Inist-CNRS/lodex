import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import Link from '../../lib/components/Link';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { getMoreDocumentData } from '../istexSummary/getIstexData';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import stylesToClassname from '../../lib/stylesToClassName';
import { HOST_TITLE_RAW } from '../istexSummary/constants';
import { ISTEX_SITE_URL } from '../../../../../src/common/externals';

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
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.data,
            isLoading: false,
        };
    }

    loadMore = () => {
        this.setState({ isLoading: true }, () =>
            getMoreDocumentData(this.state.nextPageURI).then(
                ({ hits, total, nextPageURI }) =>
                    this.setState(state => ({
                        ...state,
                        hits: state.hits.concat(hits),
                        total,
                        nextPageURI,
                        isLoading: false,
                    })),
            ),
        );
    };

    render() {
        const {
            children,
            polyglot,
            data,
            skip,
            value,
            name,
            ...props
        } = this.props;
        const { hits, total, nextPageURI, isLoading } = this.state;

        if (!hits || !hits.length) {
            return (
                <ul>
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
                            <FileDownload tooltip={polyglot.t('download')} />
                        </Link>
                    </div>
                )}
                <ul className={classnames({ skip }, skip && styles.skip)}>
                    {hits.map((item, index) => (
                        <li className={styles.li} key={index}>
                            {children({ ...props, polyglot, item })}
                        </li>
                    ))}
                </ul>
                {nextPageURI && (
                    <div className={classnames('load-more', styles.loadMore)}>
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

IstexCitationList.propTypes = {
    data: PropTypes.shape({
        hits: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired,
        nextPageURI: PropTypes.string,
    }).isRequired,
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    skip: PropTypes.bool.isRequired,
};

export default IstexCitationList;
