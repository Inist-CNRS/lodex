import { shallow } from 'enzyme';
import { Button } from '@mui/material';
import Alert from '@lodex/frontend-common/components/Alert';

// @ts-expect-error TS7017
global.UPLOAD_LIMIT = 1;

import { UploadComponent as Upload, type UploadComponentProps } from './Upload';
import { OpenWizardCard } from './importPage';

jest.mock('@lodex/frontend-common/i18n/I18NContext', () => ({
    ...jest.requireActual('@lodex/frontend-common/i18n/I18NContext'),
    useTranslate: () => ({ translate: (key: string) => `translated:${key}` }),
}));

describe('<Upload />', () => {
    it('should render the Upload button with no error', () => {
        const props: UploadComponentProps = {
            error: false,
            onFileLoad() {},
            loaders: [],
            history: {
                location: { pathname: '/data/existing' },
                push: () => {},
            },
            isFirstFile: true,
            isUploading: false,
            url: '',
            textContent: '',
            loaderName: '',
            isUrlValid: false,
            onChangeUrl() {},
            onChangeTextContent() {},
            onChangeLoaderName() {},
            onUrlUpload() {},
            onTextUpload() {},
        };
        const wrapper = shallow(<Upload {...props} />);

        const button = wrapper.find(Button).at(0);
        expect(button).toBeDefined();

        expect(
            wrapper.contains(
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>{props.error}</p>
                </Alert>,
            ),
        ).toBe(false);
    });

    it('should render the Upload button with Alert if error', () => {
        const props = {
            // @ts-expect-error TS7006
            p: { t: (key) => key },
            // the error of a failed import is a translation key
            error: 'import_error_source_unavailable',
            onFileLoad() {},
            loaders: [],
            history: { location: { pathname: '/data/existing' } },
        };
        // @ts-expect-error TS2740
        const wrapper = shallow(<Upload {...props} />);

        expect(
            wrapper.contains(
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>translated:import_error_source_unavailable</p>
                </Alert>,
            ),
        ).toBe(true);
    });

    describe('onOpenWizard', () => {
        const baseProps: UploadComponentProps = {
            error: false,
            onFileLoad() {},
            loaders: [],
            history: {
                location: { pathname: '/data/existing' },
                push: () => {},
            },
            isFirstFile: true,
            isUploading: false,
            url: '',
            textContent: '',
            loaderName: '',
            isUrlValid: false,
            onChangeUrl() {},
            onChangeTextContent() {},
            onChangeLoaderName() {},
            onUrlUpload() {},
            onTextUpload() {},
        };

        it('should not render the wizard button without onOpenWizard', () => {
            const wrapper = shallow(<Upload {...baseProps} />);

            expect(wrapper.find(OpenWizardCard)).toHaveLength(0);
        });

        it('should render the wizard button calling onOpenWizard', () => {
            const onOpenWizard = jest.fn();
            const wrapper = shallow(
                <Upload {...baseProps} onOpenWizard={onOpenWizard} />,
            );

            const card = wrapper.find(OpenWizardCard);
            expect(card).toHaveLength(1);
            card.prop('onOpen')();
            expect(onOpenWizard).toHaveBeenCalledTimes(1);
        });
    });
});
