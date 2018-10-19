import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import classnames from 'classnames';
import FlatButton from 'material-ui/FlatButton';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { getMoreDocumentData } from './getIstexData';

const styles = StyleSheet.create({
    li: {
        listStyleType: 'none',
    },
    loadMore: {
        marginTop: '1.5rem',
    },
});

class IstexList extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.data;
    }

    loadMore = () => {
        getMoreDocumentData(this.state.nextPageURI).then(
            ({ hits, total, nextPageURI }) =>
                this.setState(state => ({
                    ...state,
                    hits: state.hits.concat(hits),
                    total,
                    nextPageURI,
                })),
        );
    };

    render() {
        const { children, polyglot, ...props } = this.props;

        const { hits, total, nextPageURI } = this.state;

        if (!hits || !hits.length) {
            return (
                <ul>
                    <li className={css(styles.li)}>
                        {polyglot.t('istex_no_result')}
                    </li>
                </ul>
            );
        }
        return (
            <div>
                <ul>
                    {hits.map((item, index) => (
                        <li className={css(styles.li)} key={index}>
                            {children({ ...props, polyglot, item })}
                        </li>
                    ))}
                </ul>
                {nextPageURI && (
                    <div
                        className={classnames(
                            'load-more',
                            css(styles.loadMore),
                        )}
                    >
                        <FlatButton fullWidth onClick={this.loadMore}>
                            {polyglot.t('search_load_more')} ({total -
                                hits.length})
                        </FlatButton>
                    </div>
                )}
            </div>
        );
    }
}

IstexList.propTypes = {
    data: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
};

export default IstexList;
