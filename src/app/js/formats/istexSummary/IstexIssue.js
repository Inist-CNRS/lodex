import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import Folder from 'material-ui/svg-icons/file/folder';
import translate from 'redux-polyglot/translate';

import { ISTEX_API_URL } from '../../../../common/externals';
import fetch from '../../lib/fetch';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import Alert from '../../lib/components/Alert';
import { parseFetchResult } from '../shared/fetchIstexData';
import IstexItem from '../istex/IstexItem';

export const getDocumentUrl = ({ issn, year, volume, issue }) => {
    return `${ISTEX_API_URL}/?q=(${encodeURIComponent(
        `host.issn="${issn}" AND publicationDate:"${year}" AND host.volume:"${
            volume
        }" AND host.issue:"${issue}"`,
    )})&size=10&output=*`;
};

const styles = {
    li: {
        listStyleType: 'none',
    },
};

export class IstexIssueComponent extends Component {
    state = {
        data: null,
        error: null,
        isLoading: false,
        isOpen: false,
    };

    open = () => {
        this.setState(
            {
                isOpen: true,
            },
            () => {
                if (!this.state.data) {
                    const url = getDocumentUrl(this.props);
                    this.setState({ isLoading: true });
                    fetch({ url })
                        .then(parseFetchResult)
                        .then(data =>
                            this.setState({
                                data,
                                isLoading: false,
                            }),
                        );
                }
            },
        );
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const { issue, p: polyglot } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (error) {
            return <Alert>{polyglot.t('istex_error')}</Alert>;
        }

        return (
            <div className="istex-volume">
                {isOpen ? (
                    <div>
                        <ButtonWithStatus
                            label={`${polyglot.t('issue')} ${issue}`}
                            labelPosition="after"
                            icon={<Folder />}
                            onClick={this.close}
                            loading={isLoading}
                        />
                        <ul>
                            {get(data, 'hits', []).map(item => (
                                <li key={item.id} style={styles.li}>
                                    <IstexItem {...item} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <ButtonWithStatus
                        label={`${polyglot.t('issue')} ${issue}`}
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

IstexIssueComponent.propTypes = {
    issn: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    issue: PropTypes.number.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(IstexIssueComponent);
