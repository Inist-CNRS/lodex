import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import IstexList from './IstexList';

describe('IstexList', () => {
    const defaultProps = {
        data: ['item1', 'item2', 'item3'],
        other: 'props',
    };

    beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());

    it('should pass each data item in children along with the other props', () => {
        const children = jest.fn(({ item }) => (
            <div className={item}>{item}</div>
        ));
        const wrapper = shallow(
            <IstexList {...defaultProps}>{children}</IstexList>,
        );

        expect(wrapper.find('li')).toHaveLength(3);
        expect(wrapper.find('.item1').text()).toEqual('item1');
        expect(wrapper.find('.item2').text()).toEqual('item2');
        expect(wrapper.find('.item3').text()).toEqual('item3');
        expect(children).toHaveBeenCalledTimes(3);
        expect(children).toHaveBeenCalledWith({
            item: 'item1',
            other: 'props',
        });
        expect(children).toHaveBeenCalledWith({
            item: 'item2',
            other: 'props',
        });
        expect(children).toHaveBeenCalledWith({
            item: 'item3',
            other: 'props',
        });
    });

    afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());
});
