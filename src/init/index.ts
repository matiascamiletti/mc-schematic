import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function runCommand(command: string, _context: SchematicContext) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      _context.logger.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      _context.logger.warn(`⚠️ Warning: ${stderr}`);
    }
    _context.logger.info(`✅ Result: ${stdout}`);
  });
}

function createFileWithTemplate(tree: Tree, fileName: string, template: string) {
  const filePath = path.join(__dirname, 'files/' + template);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    tree.create(fileName, content);
  }
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function init(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    
    // Install the required dependencies
    runCommand('npm install --save @mckit/core primeng @primeng/themes primeicons @ngx-pwa/local-storage@19', _context);
    runCommand('npm install tailwindcss @tailwindcss/postcss postcss --force', _context);
    runCommand('npm i tailwindcss-primeui --save', _context);

    // Create .postcssrc.json file from template
    createFileWithTemplate(tree, '.postcssrc.json', '.postcssrc.json.template');

    return tree;
  };
}
