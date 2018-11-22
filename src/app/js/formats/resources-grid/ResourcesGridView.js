import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import LodexResource from '../shared/LodexResource';
import { field as fieldPropTypes } from '../../propTypes';
import injectData from '../injectData';
import stylesToClassname from '../../lib/stylesToClassName';

class ResourcesGridView extends Component {
    static propTypes = {
        field: fieldPropTypes.isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        spaceWidth: PropTypes.string.isRequired,
        filterFormatData: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            fetch: false,
        };
    }

    render() {
        const { data, spaceWidth } = this.props;
        const styles = stylesToClassname(
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
        );

        return (
            <div>
                <ul className={styles.list}>
                    {data.map((entry, index) => {
                        const key = `${index}-resources-grid`;
                        return (
                            <li key={key} className={styles.item}>
                                <div className={styles.content}>
                                    <LodexResource {...entry} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state, { formatData, spaceWidth }) => {
    if (!formatData || !formatData.items) {
        return {
            data: [],
        };
    }

    return {
        data: formatData.items,
        spaceWidth,
    };
};

export default compose(
    injectData(),
    connect(mapStateToProps),
)(ResourcesGridView);
