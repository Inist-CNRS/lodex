import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Folder from 'material-ui/svg-icons/file/folder';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import translate from 'redux-polyglot/translate';
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

export class FetchFold extends Component {
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
        const { label, p: polyglot, children } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (error) {
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
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
                            {isLoading && circularProgress}
                        </div>
                    </Button>
                    {isOpen && (
                        <ul>
                            {data.map(value => (
                                <li
                                    key={get(value, 'id', value)}
                                    className={css(styles.li)}
                                >
                                    {children(value)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    }
}

FetchFold.propTypes = {
    label: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    getData: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
};

export default translate(FetchFold);
