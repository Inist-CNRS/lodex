import Path from 'path';
import fs from 'fs';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message

import ezs from '@ezs/core';
import config from '../../../config.json';

export default class Script {
    cache: any;
    cacheEnable: any;
    declared: any;
    local: any;
    constructor(source: any) {
        const routineLocalDirectory = Path.resolve(
            __dirname,
            '../../../workers',
            `${source}/`,
        );

        // @ts-expect-error TS(7053): Element implicitly has an any type because expression of type any can't be used to index type
        const routinesDeclared = config[source] || [];
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

        const cacheParameter = `${source}Cache`;
        this.declared = routinesDeclared;
        this.local = routinesLocal;

        this.cache = {};
        // @ts-expect-error TS(2304): Cannot find name 'Boolean'.
        this.cacheEnable = Boolean(config[cacheParameter] || false);
    }

    async get(routineCalled: any) {
        if (this.cache[routineCalled]) {
            return this.cache[routineCalled];
        }

        const routineLocal = this.local.find(
            (r: any) => r[2] === routineCalled,
        );
        if (routineLocal) {
            this.cache[routineCalled] = routineLocal;
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

    useCache() {
        return this.cacheEnable;
    }
}
