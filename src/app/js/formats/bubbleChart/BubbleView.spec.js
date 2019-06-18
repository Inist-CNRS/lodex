import React from 'react';
import { shallow } from 'enzyme';

import { BubbleView } from './BubbleView';

const data = [
    { data: { _id: 'id1' }, r: 10, x: 10, y: 10, value: 1 },
    { data: { _id: 'id2' }, r: 20, x: 20, y: 20, value: 2 },
    { data: { _id: 'id3' }, r: 30, x: 30, y: 30, value: 3 },
];

describe('BubbleView', () => {
    it('should render Bubble chart', () => {
        const wrapper = shallow(
            <BubbleView data={data} diameter={100} colorSet={() => 'color'} />,
        );

        const bubbles = wrapper.find('Bubble');
        expect(bubbles.length).toBe(3);

        expect(bubbles.map(b => b.props())).toEqual([
            { color: 'color', name: 'id1', r: 10, value: 1, x: 10, y: 10 },
            { color: 'color', name: 'id2', r: 20, value: 2, x: 20, y: 20 },
            { color: 'color', name: 'id3', r: 30, value: 3, x: 30, y: 30 },
        ]);
    });

    it('should not fail to render if the diameter is a string', () => {
        const wrapper = shallow(
            <BubbleView
                data={data}
                diameter={'100'}
                colorSet={() => 'color'}
            />,
        );

        const bubbles = wrapper.find('Bubble');
        expect(bubbles.length).toBe(3);

        expect(bubbles.map(b => b.props())).toEqual([
            { color: 'color', name: 'id1', r: 10, value: 1, x: 10, y: 10 },
            { color: 'color', name: 'id2', r: 20, value: 2, x: 20, y: 20 },
            { color: 'color', name: 'id3', r: 30, value: 3, x: 30, y: 30 },
        ]);
    });
});
