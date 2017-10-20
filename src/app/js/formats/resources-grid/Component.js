import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import MQS from 'mongodb-querystring';
import url from 'url';
import querystring from 'querystring';
import RaisedButton from 'material-ui/RaisedButton';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite';
import { field as fieldPropTypes } from '../../propTypes';


class ResourcesGrid extends Component {
    static propTypes = {
        field: fieldPropTypes.isRequired,
        linkedResource: PropTypes.object, // eslint-disable-line
        resource: PropTypes.object.isRequired, // eslint-disable-line
    }

    constructor(props) {
        super(props);
        this.state = {
            more: 0,
            data: [],
        };
        this.handleMore = this.handleMore.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const { field, resource } = this.props;
        const orderBy = field.format && field.format.args && field.format.args.orderBy ? field.format.args.orderBy : 'value/asc';
        const maxSize = field.format && field.format.args && field.format.args.maxSize ? field.format.args.maxSize : '5';
        const [sortBy, sortDir] = String(orderBy || 'value/asc').split('/');
        const by = sortBy === 'value' ? 'value' : '_id';
        const dir = sortDir === 'asc' ? 1 : -1;
        const sort = {};
        sort[by] = dir;

        const uri = url.parse(resource[field.name]);
        const query = querystring.parse(uri.query || '');
        const mongoQuery = {
            $query: query,
            $skip: 0,
            $limit: maxSize + this.state.more,
            $orderby: sort,
        };
        const uriNew = {
            ...uri,
            search: MQS.stringify(mongoQuery),
        };
        if (uri.pathname.indexOf('/api/') === 0) {
            uriNew.host = window.location.host;
            uriNew.protocol = window.location.protocol;
        }
        const apiurl = url.format(uriNew);
        const response = await fetch(apiurl);
        const result = await response.json();
        if (result.data) {
            this.setState({ data: result.data });
        }
        if (result.aggregations) {
            const firstKey = Object.keys(result.aggregations).shift();
            const data = result.aggregations[firstKey].buckets
                .map(item => ({ name: item.keyAsString || item.key, value: item.docCount }));
            this.setState({ data });
        }
    }

    handleMore(event) {
        this.setState(prevState => ({ more: prevState.more + 10 }));
        this.fetchData();
        event.preventDefault();
    }


    render() {
        const { field } = this.props;
        const spaceWidth = field.format && field.format.args && field.format.args.spaceWidth ? field.format.args.spaceWidth : '30%';
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
            contentTitle: {
                fontSize: '16px',
                lineHeight: '20px',
                fontWeight: '400',
            },
            contentParagraph: {
                flex: '1 0 auto',
                color: '#A1A1A4',
                lineHeight: '16px',
                textTransform: 'uppercase',
            },
            contentLink: {
                cursor: 'pointer',
                textDecoration: 'inherit',
                color: 'inherit',
                fill: 'inherit',
                ':hover': {
                    textDecoration: 'inherit',
                    color: 'inherit',
                    fill: 'inherit',
                },
                ':active': {
                    textDecoration: 'inherit',
                    color: 'inherit',
                    fill: 'inherit',
                },
            },
        });
        const { data } = this.state;
        return (
            <div>
                <ul className={css(styles.list)}>
                    {
                        data.map((entry, index) => {
                            const key = String(index).concat('ResourcesGrid');
                            const link = `/${entry._id}`;
                            const title = entry.value[0];
                            const description = entry.value[1];
                            return (<li key={key} className={css(styles.item)}>
                                <div className={css(styles.content)}>
                                    <a className={css(styles.contentLink)} href={link}>
                                        <div className={css(styles.contentTitle)}>
                                            {title}
                                        </div>
                                        <div className={css(styles.contentParagraph)}>
                                            {description}
                                        </div>
                                    </a>
                                </div>
                            </li>);
                        })
                    }
                </ul>
                <div className={css(styles.button)}>
                    <RaisedButton label="MORE" onClick={this.handleMore} />
                </div>
            </div>

        );
    }
}


export default translate(ResourcesGrid);

