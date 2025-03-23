import { Tree } from '@angular-devkit/schematics';
import * as fs from 'fs';
import * as path from 'path';

export function createFileWithTemplate(tree: Tree, dirname: string, fileName: string, template: string, vars: { [key: string]: string }) {
  // Verify if exist the file
  if (tree.exists(fileName)) {
    return;
  }

  const filePath = path.join(dirname, 'files/' + template);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace vars
    Object.keys(vars).forEach(key => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), vars[key]);
    });

    tree.create(fileName, content);
  }
}