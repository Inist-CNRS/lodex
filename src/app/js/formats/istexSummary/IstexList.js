import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { getMoreDocumentData } from './getIstexData';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        li: {
            listStyleType: 'none',
        },
        loadMore: {
            marginTop: '1.5rem',
        },
        skip: {
            paddingLeft: 0,
        },
    },
    'istex-list',
);

class IstexList extends Component {
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
        const { children, polyglot, data, skip, ...props } = this.props;
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
