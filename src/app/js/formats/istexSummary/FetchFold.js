import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Folder from 'material-ui/svg-icons/file/folder';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { StyleSheet, css } from 'aphrodite/no-important';
import Button from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import get from 'lodash.get';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';

const styles = StyleSheet.create({
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
});

const circularProgress = (
    <CircularProgress
        size={20}
        innerStyle={{
            display: 'flex',
            marginLeft: 8,
        }}
    />
);

class SkipFold extends Component {
    state = {
        data: null,
        error: null,
        isLoading: true,
    };

    UNSAFE_componentWillMount() {
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
                this.setState({ error: true, isLoading: false });
            });
    }

    render() {
        const { polyglot } = this.props;
        const { data, isLoading, error } = this.state;

        if (error) {
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
        }

        if (isLoading) {
            return circularProgress;
        }

        if (!data.hits.length) {
            return null;
        }

        return this.props.children({ ...this.props, data, skip: false });
    }
}

SkipFold.propTypes = {
    children: PropTypes.func.isRequired,
    polyglot: polyglotPropTypes.isRequired,
    getData: PropTypes.func.isRequired,
};

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
                        <div className={css(styles.buttonLabel)}>
                            <Arrow
                                className={
                                    isOpen ? undefined : css(styles.arrowClose)
                                }
                            />
                            {isOpen ? <FolderOpen /> : <Folder />}
                            <span className={css(styles.labelText)}>
                                {label}
                            </span>
                            <span className={css(styles.count)}>{count}</span>
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
