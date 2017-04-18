import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import PublicationExcerptLine from './PublicationExcerptLine';
import PublicationExcerptLineCol from './PublicationExcerptLineCol';

describe('<PublicationExcerptLine />', () => {
    it('should render cols', () => {
        const columns = [{ name: 'foo', label: 'foo' }, { name: 'bar', label: 'bar' }];
        const line = { uri: 'uri1', foo: 'foo', bar: 'bar' };
        const wrapper = shallow(<PublicationExcerptLine
            columns={columns}
            line={line}
            p={{ t: key => key }}
        />);

        const excerptLineCols = wrapper.find(PublicationExcerptLineCol);
        expect(excerptLineCols.at(0).props()).toEqual({
            line,
            field: columns[0],
        });
        expect(excerptLineCols.at(1).props()).toEqual({
            line,
            field: columns[1],
        });
    });
});
