import { shallow } from 'enzyme';

import HtmlView from './HtmlView';

describe('<HtmlView />', () => {
    it('should render', () => {
        const resource = { foo: '<h1>Run you fools!</h1>' };
        const field = { name: 'foo' };
        // @ts-expect-error TS2322
        const wrapper = shallow(<HtmlView resource={resource} field={field} />);
        expect(wrapper.find('div')).toHaveLength(1);
        expect(wrapper.prop('dangerouslySetInnerHTML')).toEqual({
            __html: '<h1>Run you fools!</h1>',
        });
    });
});
