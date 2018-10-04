import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Folder from 'material-ui/svg-icons/file/folder';
import translate from 'redux-polyglot/translate';
import { StyleSheet, css } from 'aphrodite/no-important';

import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Alert from '../../lib/components/Alert';

const styles = StyleSheet.create({
    li: {
        listStyleType: 'none',
    },
});

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
            this.props.getData(this.props).then(data => {
                this.setState({
                    data,
                    isLoading: false,
                    isOpen: true,
                });
            });
        });
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const { label, p: polyglot, renderData } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (error) {
            return <Alert>{polyglot.t('istex_error')}</Alert>;
        }

        return (
            <div className="istex-fold">
                {isOpen ? (
                    <div>
                        <ButtonWithStatus
                            label={label}
                            labelPosition="after"
                            icon={<Folder />}
                            onClick={this.close}
                            loading={isLoading}
                        />
                        <ul>
                            {data.map(value => (
                                <li key={value} className={css(styles.li)}>
                                    {renderData(value)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <ButtonWithStatus
                        label={label}
                        labelPosition="after"
                        icon={<Folder />}
                        onClick={this.open}
                        loading={isLoading}
                    />
                )}
            </div>
        );
    }
}

FetchFold.propTypes = {
    issn: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    p: polyglotPropTypes.isRequired,
    getData: PropTypes.func.isRequired,
    renderData: PropTypes.func.isRequired,
};

export default translate(FetchFold);
