// @ts-expect-error TS(1259): Module 'from' can only be default-imported using the 'esModuleInterop' flag
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to set the 'moduleResolution' option to 'node'?
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set the 'moduleResolution' option to 'node'?
import ezsLodex from '../src';

ezs.use(ezsLodex);

const run = (input: string[], params: any, env: any = {}): Promise<string[]> =>
    new Promise((resolve, reject) => {
        const res: string[] = [];
        from(input)
            .pipe(ezs('envExtract', params, env))
            .on('data', (data: string) => {
                res.push(data);
            })
            .on('end', () => resolve(res))
            .on('error', reject);
    });

describe('envExtract', () => {
    it('should put the allowed variable in the environment and remove it from the text', async () => {
        const env: any = {};
        const res = await run(
            ['---\nAPI_KEY: xxxxx\n---\ndu texte\nblablaba\n'],
            { allow: 'API_KEY' },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env.API_KEY).toEqual('xxxxx');
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['du texte\nblablaba\n']);
    });

    it('should accept both ":" and "=" and unquote the values', async () => {
        const env: any = {};
        const res = await run(
            [
                '---\nAPI_KEY=xxxxx\nOTHER_VAR: "value with spaces"\nTHIRD: \'quoted\'\n---\ntext',
            ],
            { allow: ['API_KEY', 'OTHER_VAR', 'THIRD'] },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({
            API_KEY: 'xxxxx',
            OTHER_VAR: 'value with spaces',
            THIRD: 'quoted',
        });
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['text']);
    });

    it('should accept a comma-separated list of allowed names', async () => {
        const env: any = {};
        await run(
            ['---\nAPI_KEY: a\nOTHER_VAR: b\n---\ntext'],
            { allow: 'API_KEY, OTHER_VAR' },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({ API_KEY: 'a', OTHER_VAR: 'b' });
    });

    it('should ignore the not allowed lines but still remove the front matter', async () => {
        const env: any = {};
        const res = await run(
            [
                '---\nAPI_KEY: xxxxx\nNODE_ENV: production\ntitle: hello\n---\ntext',
            ],
            { allow: 'API_KEY' },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({ API_KEY: 'xxxxx' });
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['text']);
    });

    it('should set nothing but still remove the front matter when allow is empty', async () => {
        const env: any = {};
        const res = await run(['---\nAPI_KEY: xxxxx\n---\ntext'], {}, env);
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({});
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['text']);
    });

    it('should not overwrite an existing variable by default', async () => {
        const env: any = { API_KEY: 'original' };
        const res = await run(
            ['---\nAPI_KEY: xxxxx\n---\ntext'],
            { allow: 'API_KEY' },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env.API_KEY).toEqual('original');
        // the line is removed from the text even if the value is ignored
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['text']);
    });

    it('should overwrite an existing variable with overwrite=true', async () => {
        const env: any = { API_KEY: 'original' };
        await run(
            ['---\nAPI_KEY: xxxxx\n---\ntext'],
            { allow: 'API_KEY', overwrite: true },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env.API_KEY).toEqual('xxxxx');
    });

    it('should leave the text unchanged when there is no front matter', async () => {
        const env: any = {};
        const input = 'du texte\nAPI_KEY=xxxxx\nblablaba\n';
        const res = await run([input], { allow: 'API_KEY' }, env);
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({});
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual([input]);
    });

    it('should ignore a front matter that is not at the very beginning', async () => {
        const env: any = {};
        const input = 'intro\n---\nAPI_KEY: xxxxx\n---\ntext';
        const res = await run([input], { allow: 'API_KEY' }, env);
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({});
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual([input]);
    });

    it('should never touch the body of the text', async () => {
        const env: any = {};
        const res = await run(
            ['---\nAPI_KEY: xxxxx\n---\nurl?a=b\nAPI_KEY: not a variable\n'],
            { allow: 'API_KEY' },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env).toEqual({ API_KEY: 'xxxxx' });
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['url?a=b\nAPI_KEY: not a variable\n']);
    });

    it('should handle Windows line endings', async () => {
        const env: any = {};
        const res = await run(
            ['---\r\nAPI_KEY: xxxxx\r\n---\r\ntext\r\n'],
            { allow: 'API_KEY' },
            env,
        );
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(env.API_KEY).toEqual('xxxxx');
        // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
        expect(res).toEqual(['text\r\n']);
    });

    it('should work in a script', (done) => {
        const res: any = [];
        from(['---\nAPI_KEY: xxxxx\n---\ndu texte\n'])
            .pipe(
                ezs('delegate', {
                    script: `[envExtract]
                allow = API_KEY
                `,
                }),
            )
            .on('data', (data: any) => {
                res.push(data);
            })
            .on('end', () => {
                // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Assertion'.
                expect(res).toEqual(['du texte\n']);
                done();
            })
            .on('error', done);
    });
});
