import { shallow } from 'enzyme';
import { Button } from '@mui/material';
import Alert from '../../lib/components/Alert';

import { UploadComponent as Upload } from './Upload';

describe('<Upload />', () => {
    it('should render the Upload button with no error', () => {
        const props = {
            // @ts-expect-error TS7006
            p: { t: (key) => key },
            error: false,
            onFileLoad() {},
            loaders: [],
            history: { location: { pathname: '/data/existing' } },
        };
        // @ts-expect-error TS2740
        const wrapper = shallow(<Upload {...props} />);

        const button = wrapper.find(Button).at(0);
        expect(button).toBeDefined();

        expect(
            wrapper.contains(
                // @ts-expect-error TS2345
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
                // @ts-expect-error TS2345
                <Alert>
                    <p>Error uploading given file: </p>
                    <p>{props.error}</p>
                </Alert>,
            ),
        ).toBe(true);
    });
});
