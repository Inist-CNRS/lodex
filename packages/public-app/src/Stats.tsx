import { useTranslate } from '../../../src/app/js/i18n/I18NContext';

const styles = {
    nb: {
        fontWeight: 'bold',
        height: '36px',
        lineHeight: '36px',
    },
};

interface StatsComponentProps {
    nbResources: number;
    currentNbResources: number;
}

export const StatsComponent = ({
    nbResources,
    currentNbResources,
}: StatsComponentProps) => {
    const { translate } = useTranslate();
    return (
        <div className="stats" style={styles.nb}>
            {translate('resources_found', {
                current: currentNbResources,
                total: nbResources,
            })}
        </div>
    );
};

export default StatsComponent;
