import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'omni-fetch';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite';

import LodexResource from '../shared/LodexResource';
import { field as fieldPropTypes } from '../../propTypes';
import getQueryString from '../../lib/getQueryString';

class ResourcesGridView extends Component {
    static propTypes = {
        field: fieldPropTypes.isRequired,
        linkedResource: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            fetch: false,
            maxSize: 0,
            more: 0,
            total: 0,
            data: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        this.setState({ fetch: true });
        const { field } = this.props;
        const orderBy =
            field.format && field.format.args && field.format.args.orderBy
                ? field.format.args.orderBy
                : 'value/asc';
        const maxSize = Number(
            field.format && field.format.args && field.format.args.maxSize
                ? field.format.args.maxSize
                : 5,
        );

        const [sortBy, sortDir] = String(orderBy || 'value/asc').split('/');
        const by = sortBy === 'value' ? 'value' : '_id';
        const dir = sortDir === 'asc' ? 1 : -1;
        const sort = {};
        sort[by] = dir;

        const queryString = getQueryString({
            sort,
            params: { maxSize: maxSize + this.state.more },
        });

        const url = `/api/run/syndication/?${queryString}`;

        const response = await fetch(url);
        const result = await response.json();
        const data = result.data || result.items || [];
        const total = result.total || 0;
        this.setState({ data, total, maxSize, fetch: false });
    }

    handleMore = () => {
        this.setState(
            prevState => ({ more: prevState.more + 10 }),
            () => this.fetchData(),
        );
    };

    render() {
        const { field } = this.props;
        const spaceWidth =
            field.format && field.format.args && field.format.args.spaceWidth
                ? field.format.args.spaceWidth
                : '30%';
        const styles = StyleSheet.create({
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
        });
        return (
            <div>
                <ul className={css(styles.list)}>
                    {this.state.data.map((entry, index) => {
                        const key = String(index).concat('ResourcesGrid');
                        return (
                            <li key={key} className={css(styles.item)}>
                                <div className={css(styles.content)}>
                                    <LodexResource {...entry} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <div className={css(styles.button)}>
                    {this.state.maxSize < this.state.total && (
                        <RaisedButton
                            label="MORE"
                            onClick={this.handleMore}
                            icon={
                                this.state.fetch && (
                                    <CircularProgress size={20} />
                                )
                            }
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default translate(ResourcesGridView);
