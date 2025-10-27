import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

interface CenterIconProps {
    polyglot: unknown;
}

const CenterIcon = ({ polyglot }: CenterIconProps) => (
    <>
        <FontAwesomeIcon
            data-tip
            data-for="centerIconTooltip"
            icon={faUndo}
            height={30}
        />
        <ReactTooltip id="centerIconTooltip" place="right" effect="solid">
            {/*
             // @ts-expect-error TS18046 */}
            {polyglot.t('graph_reinit')}
        </ReactTooltip>
    </>
);

export default CenterIcon;
