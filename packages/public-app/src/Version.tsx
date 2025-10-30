import Link from '@lodex/frontend-common/components/Link';
import Container from '@mui/material/Container';

import { version } from '../../../package.json';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

const link = `//github.com/Inist-CNRS/lodex/releases/tag/v${version}`;

export const VersionComponent = () => {
    const { translate } = useTranslate();
    return (
        <div id="version">
            <Container
                maxWidth="xl"
                className="container version-container"
                style={{
                    color: 'gray',
                    fontSize: '12px',
                    fontWeight: '300',
                    right: '10px',
                    width: '100%',
                    padding: '10px',
                    textAlign: 'right',
                    paddingBottom: 85,
                }}
            >
                {translate('powered')}{' '}
                <strong>
                    Lodex <Link href={link}>{version}</Link>
                </strong>
            </Container>
        </div>
    );
};

export default VersionComponent;
