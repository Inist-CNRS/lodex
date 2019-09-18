import React from 'react';
import { shallow } from 'enzyme';
import { List } from '@material-ui/core';

import Alert from '../../lib/components/Alert';
import { IstexView } from './IstexView';
import IstexItem from './IstexItem';

describe('<IstexView />', () => {
    it('should display .istex-list if data.hits', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{
                    hits: [
                        {
                            id: 1,
                            title: 'title1',
                            publicationDate: '1901',
                            url: 'url1',
                            authors: 'authors1',
                            hostTitle: 'hostTitle1',
                            hostGenre: 'hostGenre1',
                        },
                        {
                            id: 2,
                            title: 'title2',
                            publicationDate: '1902',
                            url: 'url2',
                            authors: 'authors2',
                            hostTitle: 'hostTitle2',
                            hostGenre: 'hostGenre2',
                        },
                    ],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        expect(wrapper.find('.istex-list').length).toEqual(1);
    });

    it('should not display List if no data.hits', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{ total: 0 }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        expect(wrapper.find(List).length).toEqual(0);
    });

    // The above condition should never happen
    // The next test is more realistic, but should ideally not display 1 element
    it('should display .list if data.hits is empty', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{ total: 0, hits: [] }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        expect(wrapper.find('.istex-list').length).toEqual(1);
    });

    it('should create one IstexItem per hit inside List', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{
                    hits: [
                        {
                            id: 1,
                            title: 'title1',
                            publicationDate: '1901',
                            url: 'url1',
                            authors: 'authors1',
                            hostTitle: 'hostTitle1',
                            hostGenre: 'hostGenre1',
                        },
                        {
                            id: 2,
                            title: 'title2',
                            publicationDate: '1902',
                            url: 'url2',
                            authors: 'authors2',
                            hostTitle: 'hostTitle2',
                            hostGenre: 'hostGenre2',
                        },
                    ],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        const list = wrapper.find('.istex-list');
        const istexItems = list.find(IstexItem);
        expect(istexItems.length).toEqual(2);
        expect(istexItems.at(0).props()).toEqual({
            id: 1,
            title: 'title1',
            publicationDate: '1901',
            url: 'url1',
            authors: 'authors1',
            hostTitle: 'hostTitle1',
            hostGenre: 'hostGenre1',
        });
        expect(istexItems.at(1).props()).toEqual({
            id: 2,
            title: 'title2',
            publicationDate: '1902',
            url: 'url2',
            authors: 'authors2',
            hostTitle: 'hostTitle2',
            hostGenre: 'hostGenre2',
        });
    });

    it('should display a span with `Istex result for value`', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{
                    hits: [],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        const span = wrapper.find('span');
        expect(span.text()).toBe('istex_total');
    });

    it('should dislay Alert with error if there is one error', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{
                    hits: [],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                error="error message"
                p={{ t: v => v }}
            />,
        );

        const alert = wrapper.find(Alert);
        expect(alert.length).toBe(1);
        expect(alert.find('p').text()).toBe('error message');
    });

    it('should not dislay Alert if no error', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                data={{
                    hits: [],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );

        const alert = wrapper.find(Alert);
        expect(alert.length).toBe(0);
    });
});
