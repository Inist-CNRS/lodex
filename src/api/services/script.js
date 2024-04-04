import Path from 'path';
import fs from 'fs';
import ezs from '@ezs/core';
import config from '../../../config.json';

export default class Script {
    constructor(source) {
        const routineLocalDirectory = Path.resolve(
            __dirname,
            '../../../workers',
            `${source}/`,
        );

        const routinesDeclared = config[source] || [];
        const routinesLocal = routinesDeclared
            .map((routineName) =>
                Path.resolve(routineLocalDirectory, routineName.concat('.ini')),
            )
            .filter((fileName) => fs.existsSync(fileName))
            .map((fileName) => [
                fileName,
                ezs.metaFile(fileName),
                Path.basename(fileName, '.ini'),
                fs.readFileSync(fileName).toString(),
            ]);

        const cacheParameter = `${source}Cache`;
        this.declared = routinesDeclared;
        this.local = routinesLocal;

        this.cache = {};
        this.cacheEnable = Boolean(config[cacheParameter] || false);
    }

    async get(routineCalled) {
        if (this.cache[routineCalled]) {
            return this.cache[routineCalled];
        }

        const routineLocal = this.local.find((r) => r[2] === routineCalled);
        if (routineLocal) {
            this.cache[routineCalled] = routineLocal;
            return routineLocal;
        }
    }

    async list() {
        const availableListPromises = this.declared.map((name) =>
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
            .filter((script) => script.label !== undefined);
    }

    useCache() {
        return this.cacheEnable;
    }
}
