import { getPathname, getScriptsFromHtml } from './customPage';

describe('customPage', () => {
    describe('getScriptFromHtml', () => {
        it('should return empty array if no script tag', () => {
            expect(getScriptsFromHtml('')).toEqual([]);
        });

        it('should return list of script src attributes', () => {
            expect(
                getScriptsFromHtml(
                    '<h1>Some Title</h1>\n<script src="script1.js" ></script>\n<script async src="script2.js" ></script>',
                ),
            ).toEqual(['script1.js', 'script2.js']);
        });

        it('should ignore script with no src attributes', () => {
            expect(
                getScriptsFromHtml(
                    '<h1>Some Title</h1>\n<script>alert("hi")</script>',
                ),
            ).toEqual([]);
        });
    });
    describe('getPathName', () => {
        it('should return pathname in tenant directory', async () => {
            expect(await getPathname('mySite', 'tenant')).toBe(
                '/app/src/app/custom/instance/tenant/mySite.html',
            );
        });
        it('should return folder/index.html if folder exists in tenant directory', async () => {
            expect(await getPathname('folder', 'test')).toBe(
                '/app/src/app/custom/instance/test/folder/index.html',
            );
        });
        it('should return null if given path is not in tenant directory', async () => {
            expect(await getPathname('../.env', 'test')).toBeNull();
        });
    });
});
