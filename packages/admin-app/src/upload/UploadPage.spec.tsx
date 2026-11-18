import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { useSiteModel } from './useSiteModel';
import { UploadPage } from './UploadPage';

jest.mock('./useSiteModel', () => ({ useSiteModel: jest.fn() }));
jest.mock('./Upload', () => ({
    __esModule: true,
    default: () => <div>full upload</div>,
}));
jest.mock('./SimplifiedUpload', () => ({
    SimplifiedUpload: ({ hasData }: { hasData: boolean }) => (
        <div>{`simplified upload ${hasData}`}</div>
    ),
}));

const siteModel = {
    model: { id: 'a', url: 'u', loader: 'l', importTypes: ['file'] },
};

describe('UploadPage', () => {
    it('shows a spinner while the site model loads', () => {
        (useSiteModel as jest.Mock).mockReturnValue({
            isLoading: true,
            siteModel: null,
        });
        render(<UploadPage isFirstFile={false} />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText('full upload')).not.toBeInTheDocument();
    });

    it('shows the full upload without site model', () => {
        (useSiteModel as jest.Mock).mockReturnValue({
            isLoading: false,
            siteModel: null,
        });
        render(<UploadPage isFirstFile={false} />);
        expect(screen.getByText('full upload')).toBeInTheDocument();
    });

    it('shows the simplified upload with a site model', () => {
        (useSiteModel as jest.Mock).mockReturnValue({
            isLoading: false,
            siteModel,
        });
        render(<UploadPage isFirstFile={false} />);
        expect(screen.getByText('simplified upload true')).toBeInTheDocument();
    });

    it('shows the simplified upload for a first file too', () => {
        (useSiteModel as jest.Mock).mockReturnValue({
            isLoading: false,
            siteModel,
        });
        render(<UploadPage isFirstFile />);
        expect(screen.getByText('simplified upload false')).toBeInTheDocument();
    });
});
