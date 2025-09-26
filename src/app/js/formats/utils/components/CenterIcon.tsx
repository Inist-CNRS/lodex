import React from 'react';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
// @ts-expect-error TS7016
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

// @ts-expect-error TS7031
const CenterIcon = ({ polyglot }) => (
    <>
        <FontAwesomeIcon
            data-tip
            data-for="centerIconTooltip"
            icon={faUndo}
            height={30}
        />
        <ReactTooltip id="centerIconTooltip" place="right" effect="solid">
            {polyglot.t('graph_reinit')}
        </ReactTooltip>
    </>
);

CenterIcon.propTypes = {
    polyglot: polyglotPropTypes.isRequired,
};

export default CenterIcon;
