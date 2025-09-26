import { getScriptsFromHtml } from './customPage';

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
