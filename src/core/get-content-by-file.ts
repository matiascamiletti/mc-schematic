import * as fs from 'fs';
import * as path from 'path';

export function getContentByFile(dirname: string, file: string) {
    const filePath = path.join(dirname, 'files/' + file);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
}