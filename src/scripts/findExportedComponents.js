/* eslint-disable no-shadow */
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';

const src = path.resolve(process.cwd(), 'src', 'js');
const readdir = Promise.promisify(fs.readdir);
const readFile = Promise.promisify(fs.readFile);

const DEPRECATED = ['FlatButton', 'RaisedButton', 'IconButton', 'FloatingButton', 'CardMedia', 'RadioGroup'];

export default async function findExportedComponents() {
  const folders = (await readdir(src)).filter(f => f.match(/^(?!(Transitions|FAB|Sidebar))[A-Z]/));
  return await Promise.all(folders.map(async (folder) => {
    const fullPath = path.join(src, folder);
    const lines = (await readFile(path.join(src, folder, 'index.js'), 'utf-8')).split(/\r?\n/);
    const exports = lines.reduce((exports, line) => {
      if (line.match(/export/)) {
        const module = line.replace(/export (default |{ )?(\w+).*/, '$2');
        if (exports.indexOf(module) === -1 && DEPRECATED.indexOf(module) === -1) {
          exports.push(module);
        }
      }
      return exports;
    }, []);
    return { folder, exports, fullPath };
  }));
}
