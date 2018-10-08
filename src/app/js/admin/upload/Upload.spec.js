import React from 'react';
import { shallow } from 'enzyme';
import RaisedButton from 'material-ui/RaisedButton';
import Alert from '../../lib/components/Alert';

import { UploadComponent as Upload } from './Upload';

describe('<Upload />', () => {
    beforeAll(() => {
        global.LOADERS = [];
    });

    it('should render the Upload button with no error', () => {
        const props = {
            p: { t: key => key },
            error: false,
            onFileLoad() {},
        };
        const wrapper = shallow(<Upload {...props} />);

        const raisedButton = wrapper.find(RaisedButton).at(0);
        expect(raisedButton).not.toBe(undefined);

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

    afterAll(() => {
        delete global.LOADERS;
    });
});
