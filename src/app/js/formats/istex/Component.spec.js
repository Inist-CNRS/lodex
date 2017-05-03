import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { List } from 'material-ui/List';

import Alert from '../../lib/components/Alert';
import { IstexView } from './Component';
import IstexItem from './IstexItem';

describe('<IstexView />', () => {
    it('should display List if data.hits', () => {
        const wrapper = shallow(<IstexView
            fieldStatus=""
            data={{
                hits: [
                    { id: 1, title: 'title1', publicationDate: '1901', fulltext: 'fulltext1', abstract: 'abstract1' },
                    { id: 2, title: 'title2', publicationDate: '1902', fulltext: 'fulltext2', abstract: 'abstract2' },
                ],
            }}
            field={{ name: 'name' }}
            resource={{ name: 'value' }}
            p={{ t: v => v }}
        />);
        expect(wrapper.find(List).length).toEqual(1);
    });

    it('should not display List if no data.hits', () => {
        const wrapper = shallow(<IstexView
            fieldStatus=""
            field={{ name: 'name' }}
            resource={{ name: 'value' }}
            p={{ t: v => v }}
        />);
        expect(wrapper.find(List).length).toEqual(0);
    });

    it('should create one IstexItem per hit inside List', () => {
        const wrapper = shallow(<IstexView
            fieldStatus=""
            data={{
                hits: [
                    { id: 1, title: 'title1', publicationDate: '1901', fulltext: 'fulltext1', abstract: 'abstract1' },
                    { id: 2, title: 'title2', publicationDate: '1902', fulltext: 'fulltext2', abstract: 'abstract2' },
                ],
            }}
            field={{ name: 'name' }}
            resource={{ name: 'value' }}
            p={{ t: v => v }}
        />);
        const list = wrapper.find(List);
        const istexItems = list.find(IstexItem);
        expect(istexItems.length).toEqual(2);
        expect(istexItems.at(0).props()).toEqual({
            title: 'title1',
            publicationDate: '1901',
            fulltext: 'fulltext1',
            abstract: 'abstract1',
        });
        expect(istexItems.at(1).props()).toEqual({
            title: 'title2',
            publicationDate: '1902',
            fulltext: 'fulltext2',
            abstract: 'abstract2',
        });
    });

    it('should display a span with `Istex result for value`', () => {
        const wrapper = shallow(<IstexView
            fieldStatus=""
            data={{
                hits: [],
            }}
            field={{ name: 'name' }}
            resource={{ name: 'value' }}
            p={{ t: v => v }}
        />);
        const span = wrapper.find('span');
        // expect(span.length).toBe(1);
        expect(span.at(1).text()).toBe('istex_results');
    });

    it('should dislay Alert with error if there is one error', () => {
        const wrapper = shallow(<IstexView
            fieldStatus=""
            data={{
                hits: [],
            }}
            field={{ name: 'name' }}
            resource={{ name: 'value' }}
            error="error message"
            p={{ t: v => v }}
        />);

        const alert = wrapper.find(Alert);
        expect(alert.length).toBe(1);
        expect(alert.find('p').text()).toBe('error message');
    });

    it('should not dislay Alert if no error', () => {
        const wrapper = shallow(<IstexView
            fieldStatus=""
            data={{
                hits: [],
            }}
            field={{ name: 'name' }}
            resource={{ name: 'value' }}
            p={{ t: v => v }}
        />);

        const alert = wrapper.find(Alert);
        expect(alert.length).toBe(0);
    });
});
