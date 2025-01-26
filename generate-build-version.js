console.log('Entrando a generar archivos de versionamiento');
import fs from 'fs';
import path from 'path';
import semver from 'semver';

import packageJson  from './package.json' assert {type: "json"} ;
const appVersion = packageJson.version;

const incrementVersion = (version) => {
    const versionArray = version.split('.');
    const [major,minor,patch] = versionArray;

    if (parseInt(patch) === 99) {
        const newMinor = parseInt(minor) +1;
        return `${major}.${minor}.0`;
    }

    const newPatch = parseInt(patch) + 1 ;
    return `${major}.${minor}.${newPatch}`;
}

const newVersion = incrementVersion(appVersion);

packageJson.version = newVersion;
fs.writeFileSync('./package.json', JSON.stringify(packageJson,null,2),'utf-8');
console.log('Se actualizo correctamente el archivo package.json');

const metaJson = { version: newVersion, oldVersion: appVersion };
fs.writeFileSync('./public/meta.json', JSON.stringify(metaJson,null,2),'utf-8');
console.log('Se actualizo correctamente el archivo /public/meta.json');

console.log('La Versión ha sido actualizada en el package.json y meta.json');