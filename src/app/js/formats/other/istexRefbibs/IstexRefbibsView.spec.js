import React from 'react';
import { shallow } from 'enzyme';
import { List } from '@mui/material';

import Alert from '../../../lib/components/Alert';
import { IstexRefbibsView } from './IstexRefbibsView';
import IstexItem from '../istex/IstexItem';

describe('<IstexView />', () => {
    it('should display .istex-list if data.hits', () => {
        const wrapper = shallow(
            <IstexRefbibsView
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
        expect(wrapper.find('.istex-list')).toHaveLength(1);
    });

    it('should not display List if no data.hits', () => {
        const wrapper = shallow(
            <IstexRefbibsView
                fieldStatus=""
                data={{ total: 0 }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        expect(wrapper.find(List)).toHaveLength(0);
    });

    // The above condition should never happen
    // The next test is more realistic, but should ideally not display 1 element
    it('should display .list if data.hits is empty', () => {
        const wrapper = shallow(
            <IstexRefbibsView
                fieldStatus=""
                data={{ total: 0, hits: [] }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                p={{ t: v => v }}
            />,
        );
        expect(wrapper.find('.istex-list')).toHaveLength(1);
    });

    it('should create one IstexItem per hit inside List', () => {
        const wrapper = shallow(
            <IstexRefbibsView
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
        expect(istexItems).toHaveLength(2);
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
            <IstexRefbibsView
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
            <IstexRefbibsView
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
        expect(alert).toHaveLength(1);
        expect(alert.find('p').text()).toBe('error message');
    });

    it('should not dislay Alert if no error', () => {
        const wrapper = shallow(
            <IstexRefbibsView
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
        expect(alert).toHaveLength(0);
    });
});
