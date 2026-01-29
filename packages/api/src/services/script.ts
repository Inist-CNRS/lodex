import Path from 'path';
import fs from 'fs';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import config from 'config';

const scripts = config.get('scripts');

export default class Script {
    declared: any;
    local: any;
    constructor(source: any) {
        const routineLocalDirectory = Path.resolve(
            __dirname,
            '../../../workers/src',
            `${source}/`,
        );

        // @ts-expect-error TS(7053): Element implicitly has an any type because expression of type any can't be used to index type
        const routinesDeclared = scripts[source] || [];
        const routinesLocal = routinesDeclared
            .map((routineName: any) =>
                Path.resolve(routineLocalDirectory, routineName.concat('.ini')),
            )
            .filter((fileName: any) => fs.existsSync(fileName))
            .map((fileName: any) => [
                fileName,
                ezs.metaFile(fileName),
                Path.basename(fileName, '.ini'),
                fs.readFileSync(fileName).toString(),
            ]);

        this.declared = routinesDeclared;
        this.local = routinesLocal;
    }

    async get(routineCalled: any) {
        const routineLocal = this.local.find(
            (r: any) => r[2] === routineCalled,
        );
        if (routineLocal) {
            return routineLocal;
        }
    }

    async list() {
        const availableListPromises = this.declared.map((name: any) =>
            this.get(name),
        );
        const availableList = await Promise.all(availableListPromises);
        return availableList
            .map(([, metaData, id]) => ({
                exportID: id,
                label: metaData.label,
                type: metaData.type,
                fileName: metaData.fileName,
            }))
            .filter((script: any) => script.label !== undefined);
    }
}
