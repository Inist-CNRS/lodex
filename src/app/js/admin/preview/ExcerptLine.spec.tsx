import React from 'react';
import { shallow } from 'enzyme';

import ExcerptLine from './ExcerptLine';
import ExcerptLineCol from './ExcerptLineCol';

describe('<ExcerptLine />', () => {
    it('should render cols', () => {
        const columns = [
            { name: 'foo', label: 'foo' },
            { name: 'bar', label: 'bar' },
        ];
        const line = { uri: 'uri1', foo: 'foo', bar: 'bar' };
        const wrapper = shallow(
            // @ts-expect-error TS2769
            <ExcerptLine
                columns={columns}
                line={line}
                // @ts-expect-error TS2322
                p={{ t: (key) => key }}
            />,
        );

        const excerptLineCols = wrapper.find(ExcerptLineCol);
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
