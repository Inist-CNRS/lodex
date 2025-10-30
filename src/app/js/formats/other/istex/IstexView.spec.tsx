import { shallow } from 'enzyme';
import { List } from '@mui/material';

import Alert from '@lodex/frontend-common/components/Alert';
import { IstexView } from './IstexView';
import IstexItem from './IstexItem';
import { render } from '@lodex/frontend-common/test-utils';

jest.mock('../../../lib/stylesToClassName', () => ({
    __esModule: true,
    default: (styles: Record<string, unknown>, prefix: string) => {
        const classes: Record<string, string> = {};
        Object.keys(styles).forEach((key) => {
            classes[key] = `${prefix}-${key}`;
        });
        return classes;
    },
}));

describe('<IstexView />', () => {
    it('should display .istex-list if data.hits', () => {
        const wrapper = shallow(
            <IstexView
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
            />,
        );
        expect(wrapper.find('.istex-list')).toHaveLength(1);
    });

    it('should not display List if no data.hits', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                // @ts-expect-error TS2322
                data={{ total: 0 }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
            />,
        );
        expect(wrapper.find(List)).toHaveLength(0);
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
                // @ts-expect-error TS2322
                p={{ t: (v) => v }}
            />,
        );
        expect(wrapper.find('.istex-list')).toHaveLength(1);
    });

    it('should create one IstexItem per hit inside List', () => {
        const wrapper = shallow(
            <IstexView
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
            <IstexView
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

    it('should display Alert with error if there is one error', () => {
        const screen = render(
            <IstexView
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

        expect(screen.getByText('error message')).toBeInTheDocument();
    });

    it('should not dislay Alert if no error', () => {
        const wrapper = shallow(
            <IstexView
                fieldStatus=""
                // @ts-expect-error TS2322
                data={{
                    hits: [],
                }}
                field={{ name: 'name' }}
                resource={{ name: 'value' }}
            />,
        );

        const alert = wrapper.find(Alert);
        expect(alert).toHaveLength(0);
    });
});
