import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheetTestUtils } from 'aphrodite';

import IstexList from './IstexList';
import { getMoreDocumentData } from './getIstexData';
import ButtonWithStatus from '../../lib/components/ButtonWithStatus';

jest.mock('./getIstexData.js');

describe('IstexList', () => {
    const defaultProps = {
        data: { hits: ['item1', 'item2', 'item3'], total: 3 },
        other: 'props',
        polyglot: { t: v => v },
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
            polyglot: defaultProps.polyglot,
        });
        expect(children).toHaveBeenCalledWith({
            item: 'item2',
            other: 'props',
            polyglot: defaultProps.polyglot,
        });
        expect(children).toHaveBeenCalledWith({
            item: 'item3',
            other: 'props',
            polyglot: defaultProps.polyglot,
        });
    });

    it('should display no result message if data.hits is empty', () => {
        const children = jest.fn();
        const wrapper = shallow(
            <IstexList {...defaultProps} data={{ hits: [] }}>
                {children}
            </IstexList>,
        );

        expect(wrapper.find('li')).toHaveLength(1);
        expect(wrapper.find('li').text()).toBe('istex_no_result');
        expect(children).toHaveBeenCalledTimes(0);
    });

    it('should display loadMore button if data has nextPageURI', async () => {
        const dataPromise = Promise.resolve({
            hits: ['item4', 'item5', 'item6'],
            total: 6,
            nextPageURI: null,
        });
        getMoreDocumentData.mockImplementation(() => dataPromise);
        const children = jest.fn(({ item }) => (
            <div className={item}>{item}</div>
        ));
        const wrapper = shallow(
            <IstexList
                {...defaultProps}
                data={{
                    hits: ['item1', 'item2', 'item3'],
                    total: 6,
                    nextPageURI: 'nextPageURI',
                }}
            >
                {children}
            </IstexList>,
        );

        expect(wrapper.find('li')).toHaveLength(3);
        expect(wrapper.find('.item1').text()).toEqual('item1');
        expect(wrapper.find('.item2').text()).toEqual('item2');
        expect(wrapper.find('.item3').text()).toEqual('item3');

        const button = wrapper.find(ButtonWithStatus);
        expect(button).toHaveLength(1);
        expect(button.prop('loading')).toBe(false);
        button.simulate('click');
        expect(getMoreDocumentData).toHaveBeenCalledWith('nextPageURI');
        wrapper.update();
        const loadingButton = wrapper.find(ButtonWithStatus);
        expect(loadingButton).toHaveLength(1);
        expect(loadingButton.prop('loading')).toBe(true);

        await dataPromise;
        wrapper.update();
        expect(wrapper.find(ButtonWithStatus)).toHaveLength(0);

        expect(wrapper.find('li')).toHaveLength(6);
        expect(wrapper.find('.item1').text()).toEqual('item1');
        expect(wrapper.find('.item2').text()).toEqual('item2');
        expect(wrapper.find('.item3').text()).toEqual('item3');
        expect(wrapper.find('.item4').text()).toEqual('item4');
        expect(wrapper.find('.item5').text()).toEqual('item5');
        expect(wrapper.find('.item6').text()).toEqual('item6');
    });

    afterEach(() => {
        StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
        getMoreDocumentData.mockClear();
    });
});
