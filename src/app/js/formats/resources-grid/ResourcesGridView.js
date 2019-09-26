import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { CircularProgress, Button } from '@material-ui/core';
import memoize from 'lodash.memoize';

import LodexResource from '../shared/LodexResource';
import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';
import stylesToClassname from '../../lib/stylesToClassName';

const createStyles = memoize(spaceWidth =>
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
        spaceWidth: PropTypes.string.isRequired,
        filterFormatData: PropTypes.func.isRequired,
        allowToLoadMore: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            fetch: false,
            more: 0,
        };
    }

    UNSAFE_componentWillMount() {
        const { allowToLoadMore } = this.props;

        if (allowToLoadMore) {
            this.handleMore();
        }
    }

    handleMore = () => {
        const { filterFormatData, pageSize } = this.props;

        this.setState(
            prevState => ({ more: prevState.more + pageSize }),
            () => filterFormatData({ maxSize: this.state.more }),
        );
    };

    render() {
        const {
            data,
            spaceWidth,
            total,
            allowToLoadMore,
            p: polyglot,
        } = this.props;
        const { more, fetch } = this.state;
        const styles = createStyles(spaceWidth);

        const filteredData = allowToLoadMore ? data.slice(0, more) : data;

        return (
            <div>
                <ul className={styles.list}>
                    {filteredData.map((entry, index) => (
                        <li
                            key={`${index}-resources-grid`}
                            className={styles.item}
                        >
                            <div className={styles.content}>
                                <LodexResource {...entry} />
                            </div>
                        </li>
                    ))}
                </ul>
                {allowToLoadMore && more < total && (
                    <div className={styles.button}>
                        <Button variant="contained" onClick={this.handleMore}>
                            {fetch ? <CircularProgress size={20} /> : null}
                            {polyglot.t('see_more')}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, { formatData, spaceWidth }) => {
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
    injectData(),
    connect(mapStateToProps),
    translate,
)(ResourcesGridView);
