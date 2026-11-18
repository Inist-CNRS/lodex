import { fireEvent } from '@testing-library/react';

// @ts-expect-error TS7017
global.UPLOAD_LIMIT = 1;

import { render } from '../test-utils';
import {
    DatasetSourceInput,
    getDatasetSource,
    type DatasetSourceInputProps,
} from './DatasetSourceInput';

describe('getDatasetSource', () => {
    const file = new File(['a'], 'a.csv');
    const base = { tab: 'file' as const, files: [], url: '', text: '' };

    it('should return a file source', () => {
        expect(
            getDatasetSource({
                ...base,
                files: [{ file, data: '' }],
            }),
        ).toEqual({ type: 'file', file });
    });

    it('should return a url source for http and https urls', () => {
        expect(
            getDatasetSource({ ...base, tab: 'url', url: 'https://x.org/a' }),
        ).toEqual({ type: 'url', url: 'https://x.org/a' });
        expect(
            getDatasetSource({ ...base, tab: 'url', url: 'http://x.org/a' }),
        ).toEqual({ type: 'url', url: 'http://x.org/a' });
    });

    it('should return a text source', () => {
        expect(
            getDatasetSource({ ...base, tab: 'text', text: '[{"a":1}]' }),
        ).toEqual({ type: 'text', text: '[{"a":1}]' });
    });

    it('should return null when the active tab has no valid data', () => {
        expect(getDatasetSource(base)).toBeNull();
        expect(getDatasetSource({ ...base, tab: 'url', url: '' })).toBeNull();
        expect(
            getDatasetSource({ ...base, tab: 'url', url: 'ftp://x' }),
        ).toBeNull();
        expect(getDatasetSource({ ...base, tab: 'text', text: '' })).toBeNull();
        expect(
            getDatasetSource({
                ...base,
                tab: 'url',
                url: '',
                text: 'x',
                files: [{ file, data: '' }],
            }),
        ).toBeNull();
    });
});

describe('<DatasetSourceInput />', () => {
    const props: DatasetSourceInputProps = {
        tab: 'file',
        onTabChange: jest.fn(),
        files: [],
        onFilesChange: jest.fn(),
        url: '',
        onUrlChange: jest.fn(),
        text: '',
        onTextChange: jest.fn(),
    };

    it('should render the three tabs and notify tab changes', () => {
        const onTabChange = jest.fn();
        const { getByText } = render(
            <DatasetSourceInput {...props} onTabChange={onTabChange} />,
        );

        expect(getByText('upload_by_file')).toBeTruthy();
        expect(getByText('upload_by_url')).toBeTruthy();
        expect(getByText('upload_by_text')).toBeTruthy();

        fireEvent.click(getByText('upload_by_url'));
        expect(onTabChange).toHaveBeenCalledWith('url');
    });

    it('should show invalid_url for a non http url', () => {
        const { getByText } = render(
            <DatasetSourceInput {...props} tab="url" url="ftp://x" />,
        );

        expect(getByText('invalid_url')).toBeTruthy();
    });

    it('should render the alert between the tabs and the form', () => {
        const { getByRole, getByText } = render(
            <DatasetSourceInput {...props}>
                <p>the alert</p>
            </DatasetSourceInput>,
        );

        const alert = getByText('the alert');
        expect(
            getByRole('tablist').compareDocumentPosition(alert) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
        expect(
            alert.compareDocumentPosition(getByText('import_file_text')) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
    });
});
