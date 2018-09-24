import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import { BubbleView } from './BubbleView';

describe('BubbleView', () => {
    it('should render Bubble chart', () => {
        const data = [
            { data: { _id: 1 }, r: 10, x: 10, y: 10, value: 'first' },
            { data: { _id: 2 }, r: 20, x: 20, y: 20, value: 'second' },
            { data: { _id: 3 }, r: 30, x: 30, y: 30, value: 'third' },
        ];

        const wrapper = shallow(
            <BubbleView
                data={data}
                diameter={100}
                colorScale={() => 'color'}
            />,
        );

        const bubbles = wrapper.find('Bubble');
        expect(bubbles.length).toBe(3);

        expect(bubbles.map(b => b.props())).toEqual([
            { color: 'color', name: 1, r: 10, value: 'first', x: 10, y: 10 },
            { color: 'color', name: 2, r: 20, value: 'second', x: 20, y: 20 },
            { color: 'color', name: 3, r: 30, value: 'third', x: 30, y: 30 },
        ]);
    });
});
