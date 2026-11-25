import { shallow } from 'enzyme';
import { Button } from '@mui/material';
import Alert from '@lodex/frontend-common/components/Alert';

// @ts-expect-error TS7017
global.UPLOAD_LIMIT = 1;

import { UploadComponent as Upload, type UploadComponentProps } from './Upload';
import { OpenWizardCard } from './importPage';
import { DatasetSourceInput } from './DatasetSourceInput';
import LoaderSelect from './LoaderSelect';

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

        it('should require a real loader for a text, the automatic one needing a file extension', () => {
            const wrapper = shallow(
                <Upload
                    {...baseProps}
                    loaderName="automatic"
                    textContent="a,b"
                />,
            );
            const uploadButton = () => wrapper.find('.btn-upload-dataset');
            wrapper.find(DatasetSourceInput).prop('onTabChange')('text');

            expect(uploadButton().prop('disabled')).toBe(true);
            expect(wrapper.find(LoaderSelect).prop('value')).toBeNull();
            expect(wrapper.find(LoaderSelect).prop('allowAutomatic')).toBe(
                false,
            );

            wrapper.setProps({ loaderName: 'csv' });
            expect(uploadButton().prop('disabled')).toBe(false);
        });

        it('should keep the automatic loader for a URL ending with a known extension only', () => {
            const props = {
                ...baseProps,
                loaders: [{ name: 'csv' }],
                loaderName: 'automatic',
                isUrlValid: true,
            };
            const wrapper = shallow(
                <Upload {...props} url="https://example.org/data.csv" />,
            );
            const uploadButton = () => wrapper.find('.btn-upload-dataset');
            wrapper.find(DatasetSourceInput).prop('onTabChange')('url');

            expect(uploadButton().prop('disabled')).toBe(false);
            expect(wrapper.find(LoaderSelect).prop('value')).toBe('automatic');

            // the query string is not part of the extension
            wrapper.setProps({
                url: 'https://zenodo.org/records/1/files/data.csv?download=1',
            });
            expect(wrapper.find(LoaderSelect).prop('value')).toBe('automatic');

            wrapper.setProps({
                url: 'https://api.openalex.org/works?filter=x',
            });
            expect(uploadButton().prop('disabled')).toBe(true);
            expect(wrapper.find(LoaderSelect).prop('allowAutomatic')).toBe(
                false,
            );
        });

        it('should keep the automatic loader for a file whose extension has a loader only', () => {
            const wrapper = shallow(
                <Upload
                    {...baseProps}
                    loaders={[{ name: 'json-lines' }]}
                    loaderName="automatic"
                />,
            );
            const chooseFile = (name: string) =>
                wrapper.find(DatasetSourceInput).prop('onFilesChange')([
                    { file: new File(['{}'], name), data: '' },
                ]);

            chooseFile('data.JSONL');
            expect(wrapper.find(LoaderSelect).prop('value')).toBe('automatic');
            expect(
                wrapper.find(LoaderSelect).prop('helperText'),
            ).toBeUndefined();

            chooseFile('data.ods');
            expect(wrapper.find(LoaderSelect).prop('value')).toBeNull();
            expect(wrapper.find(LoaderSelect).prop('helperText')).toBe(
                'translated:loader_unknown_format',
            );
            expect(wrapper.find('.btn-upload-dataset').prop('disabled')).toBe(
                true,
            );
        });

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
