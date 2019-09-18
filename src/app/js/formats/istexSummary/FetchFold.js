import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Folder,
    FolderOpen,
    KeyboardArrowDown as Arrow,
} from '@material-ui/icons';
import Button from '@material-ui/core/FlatButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import get from 'lodash.get';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import SkipFold from './SkipFold';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        li: {
            listStyleType: 'none',
        },
        buttonLabel: {
            display: 'flex',
            alignItems: 'center',
            padding: '0px 8px',
        },
        labelText: {
            marginLeft: 8,
        },
        count: {
            marginLeft: 8,
            backgroundColor: '#EEE',
            borderRadius: '0.7em',
            fontSize: '0.7em',
            lineHeight: '0.7em',
            padding: '0.5em',
            fontStyle: 'italic',
        },
        arrowClose: {
            transform: 'rotate(-90deg)',
        },
    },
    'fetch-fold',
);

const circularProgress = (
    <CircularProgress
        size={20}
        innerStyle={{
            display: 'flex',
            marginLeft: 8,
        }}
    />
);

class FetchFold extends Component {
    state = {
        data: null,
        error: null,
        isLoading: false,
        isOpen: false,
    };

    open = () => {
        if (this.state.data) {
            this.setState({
                isOpen: true,
            });
            return;
        }

        this.setState({ isLoading: true }, () => {
            this.props
                .getData(this.props)
                .then(data => {
                    this.setState({
                        data,
                        isLoading: false,
                        isOpen: true,
                    });
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ error: true });
                });
        });
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const { label, count, polyglot, children, skip } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (skip) {
            return <SkipFold {...this.props} />;
        }

        if (error) {
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
        }
        if (count === 0) {
            return null;
        }

        return (
            <div className="istex-fold">
                <div>
                    <Button onClick={isOpen ? this.close : this.open}>
                        <div className={styles.buttonLabel}>
                            <Arrow
                                className={
                                    isOpen ? undefined : styles.arrowClose
                                }
                            />
                            {isOpen ? <FolderOpen /> : <Folder />}
                            <span className={styles.labelText}>{label}</span>
                            <span className={styles.count}>{count}</span>
                            {isLoading && circularProgress}
                        </div>
                    </Button>
                    {isOpen &&
                        children({
                            ...this.props,
                            data,
                            nbSiblings: get(data, 'hits.length', 0),
                        })}
                </div>
            </div>
        );
    }
}

FetchFold.propTypes = {
    label: PropTypes.string.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    getData: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
};

export default FetchFold;
