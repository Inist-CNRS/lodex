import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@mui/material';
import Alert from '../../lib/components/Alert';

import { UploadComponent as Upload } from './Upload';

describe('<Upload />', () => {
    it('should render the Upload button with no error', () => {
        const props = {
            p: { t: key => key },
            error: false,
            onFileLoad() {},
            loaders: [],
            history: { location: { pathname: '/data/existing' } },
        };
        const wrapper = shallow(<Upload {...props} />);

        const button = wrapper.find(Button).at(0);
        expect(button).not.toBeUndefined();

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
            p: { t: key => key },
            error: 'Boom',
            onFileLoad() {},
            loaders: [],
            history: { location: { pathname: '/data/existing' } },
        };
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
