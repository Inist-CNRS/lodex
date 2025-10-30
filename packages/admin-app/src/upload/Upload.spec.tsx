import { shallow } from 'enzyme';
import { Button } from '@mui/material';
import Alert from '@lodex/frontend-common/components/Alert';

import { UploadComponent as Upload, type UploadComponentProps } from './Upload';

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
            error: 'Boom',
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
                    <p>{props.error}</p>
                </Alert>,
            ),
        ).toBe(true);
    });
});
