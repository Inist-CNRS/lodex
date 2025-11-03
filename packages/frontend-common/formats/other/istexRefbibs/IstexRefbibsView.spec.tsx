import { shallow } from 'enzyme';
import { List } from '@mui/material';

import { IstexRefbibsView } from './IstexRefbibsView';
import IstexItem from '../istex/IstexItem';
import { render } from '../../../test-utils';

describe('<IstexView />', () => {
    it('should display .istex-list if data.hits', () => {
        const wrapper = shallow(
            <IstexRefbibsView
                fieldStatus=""
                data={{
                    hits: [
                        {
                            id: '1',
                            title: 'title1',
                            publicationDate: '1901',
                            url: 'url1',
                            authors: ['authors1'],
                            hostTitle: 'hostTitle1',
                            hostGenre: 'hostGenre1',
                            hostVolume: 'hostVolume1',
                        },
                        {
                            id: '2',
                            title: 'title2',
                            publicationDate: '1902',
                            url: 'url2',
                            authors: ['authors2'],
                            hostTitle: 'hostTitle2',
                            hostGenre: 'hostGenre2',
                            hostVolume: 'hostVolume2',
                        },
                    ],
                    total: 2,
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                // @ts-expect-error TS2322
                p={{ t: (v) => v }}
            />,
        );
        expect(wrapper.find('.istex-list')).toHaveLength(1);
    });

    it('should not display List if no data.hits', () => {
        const wrapper = shallow(
            <IstexRefbibsView
                fieldStatus=""
                // @ts-expect-error TS2322
                data={{ total: 0 }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                // @ts-expect-error TS2322
                p={{ t: (v) => v }}
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
                // @ts-expect-error TS2322
                p={{ t: (v) => v }}
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
                            id: '1',
                            title: 'title1',
                            publicationDate: '1901',
                            url: 'url1',
                            authors: ['authors1'],
                            hostTitle: 'hostTitle1',
                            hostGenre: 'hostGenre1',
                            hostVolume: 'hostVolume1',
                        },
                        {
                            id: '2',
                            title: 'title2',
                            publicationDate: '1902',
                            url: 'url2',
                            authors: ['authors2'],
                            hostTitle: 'hostTitle2',
                            hostGenre: 'hostGenre2',
                            hostVolume: 'hostVolume2',
                        },
                    ],
                    total: 2,
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                // @ts-expect-error TS2322
                p={{ t: (v) => v }}
            />,
        );
        const list = wrapper.find('.istex-list');
        const istexItems = list.find(IstexItem);
        expect(istexItems).toHaveLength(2);
        expect(istexItems.at(0).props()).toEqual({
            id: '1',
            title: 'title1',
            publicationDate: '1901',
            url: 'url1',
            authors: ['authors1'],
            hostTitle: 'hostTitle1',
            hostGenre: 'hostGenre1',
            hostVolume: 'hostVolume1',
        });
        expect(istexItems.at(1).props()).toEqual({
            id: '2',
            title: 'title2',
            publicationDate: '1902',
            url: 'url2',
            authors: ['authors2'],
            hostTitle: 'hostTitle2',
            hostGenre: 'hostGenre2',
            hostVolume: 'hostVolume2',
        });
    });

    it('should display a span with `Istex result for value`', () => {
        const screen = render(
            <IstexRefbibsView
                fieldStatus=""
                data={{
                    hits: [],
                    total: 0,
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
            />,
        );
        expect(screen.getByText('istex_total+{"total":0}')).toBeInTheDocument();
    });

    it('should dislay Alert with error if there is one error', () => {
        const screen = render(
            <IstexRefbibsView
                fieldStatus=""
                // @ts-expect-error TS2322
                data={{
                    hits: [],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                error="error message"
            />,
        );

        expect(screen.queryByRole('alert')).toBeInTheDocument();
        expect(screen.queryByText('error message')).toBeInTheDocument();
    });

    it('should not dislay Alert if no error', () => {
        const screen = render(
            <IstexRefbibsView
                fieldStatus=""
                // @ts-expect-error TS2322
                data={{
                    hits: [],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
                // @ts-expect-error TS2322
                p={{ t: (v) => v }}
            />,
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
