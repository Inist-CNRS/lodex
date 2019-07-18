import React, { Component, Fragment } from 'react';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

class CenterIcon extends Component {
    static propTypes = {
        polyglot: polyglotPropTypes.isRequired,
    };

    render() {
        const { polyglot } = this.props;

        return (
            <Fragment>
                <FontAwesomeIcon
                    data-tip
                    data-for="centerIconTooltip"
                    icon={faUndo}
                    height={30}
                />

                <ReactTooltip
                    id="centerIconTooltip"
                    place="right"
                    effect="solid"
                >
                    <ul>{polyglot.t('graph_reinit')}</ul>
                </ReactTooltip>
            </Fragment>
        );
    }
}

export default CenterIcon;
