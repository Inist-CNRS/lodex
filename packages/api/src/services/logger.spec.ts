import { LEVEL, MESSAGE } from 'triple-beam';
import { ERROR_SEPARATOR, lineFormat, parseJobMessage } from './logger';

const render = (info: any) =>
    (
        lineFormat('my-tenant').transform({
            ...info,
            [LEVEL]: info.level,
        }) as any
    )[MESSAGE];

// eslint-disable-next-line no-control-regex
const stripColors = (text: string) => text.replace(/\u001b\[\d+m/g, '');

describe('logger', () => {
    describe('lineFormat', () => {
        it('prints an upper case colored level and aligns the messages', () => {
            const info = render({ level: 'info', message: 'hello' });
            const debug = render({ level: 'debug', message: 'hello' });

            expect(info).toContain('\u001b[32mINFO\u001b[39m');
            expect(stripColors(info)).toMatch(
                /^\[my-tenant\] \d{4}-\d{2}-\d{2}T[\d:.]+Z {2}INFO {3}hello$/,
            );
            expect(stripColors(info).indexOf('hello')).toBe(
                stripColors(debug).indexOf('hello'),
            );
        });

        it('frames errors with separators, meta and stack indented below', () => {
            const entry = stripColors(
                render({
                    level: 'error',
                    message: '[BROWSER] boom',
                    source: 'window.onerror',
                    userAgent: 'Firefox',
                    stack: 'Error: boom\n    at foo',
                }),
            );
            expect(entry.split('\n')).toEqual([
                '',
                ERROR_SEPARATOR,
                expect.stringMatching(/Z {2}ERROR {2}\[BROWSER\] boom$/),
                '    source:    window.onerror',
                '    userAgent: Firefox',
                '    stack:',
                '        Error: boom',
                '            at foo',
                ERROR_SEPARATOR,
                '',
            ]);
        });

        it('indents every continuation line of the message so it cannot fake an entry', () => {
            const lines = stripColors(
                render({
                    level: 'info',
                    message:
                        'x\n[other] 2026-01-01T00:00:00.000Z  ERROR  fake\rforged',
                }),
            ).split('\n');
            expect(lines).toHaveLength(3);
            expect(lines[1]).toBe(
                '    [other] 2026-01-01T00:00:00.000Z  ERROR  fake',
            );
            expect(lines[2]).toBe('    forged');
        });
    });

    describe('parseJobMessage', () => {
        it('keeps only the text of a job JSON message', () => {
            const message = JSON.stringify({
                level: 'info',
                message: '[Instance: demo] Finished enriching #1',
                timestamp: new Date(),
                status: 'IN_PROGRESS',
            });
            expect(parseJobMessage(message)).toEqual({
                level: 'info',
                text: 'Finished enriching #1',
            });
        });

        it('returns other messages unchanged', () => {
            const error = new Error('boom');
            expect(parseJobMessage('plain text').text).toBe('plain text');
            expect(parseJobMessage('42').text).toBe('42');
            expect(parseJobMessage(error)).toEqual({ text: error });
        });
    });
});
