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
  // Verify if exist the file
  if (tree.exists(fileName)) {
    return;
  }

  const filePath = path.join(__dirname, 'files/' + template);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    tree.create(fileName, content);
  }
}

function insertStringAt(originalString: string, stringToInsert: string, position: number): string {
  if (position > originalString.length) {
    // Si la posición está fuera del rango, simplemente agrega el string al final
    return originalString + stringToInsert;
  }

  // Dividir el original en dos partes: antes y después de la posición
  const before = originalString.slice(0, position);
  const after = originalString.slice(position);

  // Insertar el string en la posición deseada
  return before + stringToInsert + after;
}

function processStyles(tree: Tree, _context: SchematicContext) {
  const filePath = 'src/styles.scss';

  if(!tree.exists(filePath)){
    return;
  }

  const fileBuffer = tree.read(filePath);
  const content = fileBuffer ? fileBuffer.toString() : '';

  if (content.includes('@use "tailwindcss";')) {
    return;
  }

  // Create string variable with the new content
  const newContent = `@use "tailwindcss";
@use "primeicons/primeicons.css";

body, html {
    height: 100%;
    margin: 0;
    min-height: 100%;
}
`;

  const updatedContent = newContent + content;
  tree.overwrite(filePath, updatedContent);
}

function processAppConfig(tree: Tree, _context: SchematicContext) {
  const filePath = 'src/app/app.config.ts';

  if(!tree.exists(filePath)){
    return;
  }

  const fileBuffer = tree.read(filePath);
  let content = fileBuffer ? fileBuffer.toString() : '';

  // Search position of the last import
  const importPosition = content.lastIndexOf('import');
  // Search position of the last ; after import position
  const importEndPosition = content.indexOf(';', importPosition);
  // Add the new import after the last import
  content = insertStringAt(content, `

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';`, importEndPosition + 1);

  // Search position of the last ]
  const providerPosition = content.lastIndexOf(']');
  // Add the new provider after the last provider
  content = insertStringAt(content, `,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: false
        }
      }
    })`, providerPosition);

  tree.overwrite(filePath, content);
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

    // Config SCSS
    processStyles(tree, _context);

    // Create .postcssrc.json file from template
    createFileWithTemplate(tree, 'tailwind.config.js', 'tailwind.config.js.template');

    // Config app.config.ts
    processAppConfig(tree, _context);

    return tree;
  };
}
