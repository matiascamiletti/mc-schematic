import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { runCommand } from '../core/run-command';
import { createFileWithTemplate } from '../core/create-file-with-template';
import { ClassData, getPropertiesByClass } from '../core/get-properties-by-class';

interface SchemaOptions {
  name: string;
  component?: string;
}

export function addTable(_options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    if (!_options.name) {
      throw new Error('El parámetro "name" es obligatorio.');
    }

    if (!_options.component) {
      throw new Error('El parámetro "component" es obligatorio.');
    }

    // Install the required dependencies
    runCommand('npm install --save @mckit/table @mckit/odata @mckit/filter @mckit/layout-core', _context);

    // Obtener path y nombre del component
    let pathComponent = _options.component.split('/');
    let nameComponent = pathComponent.pop();
    let path = pathComponent.join('/');

    // Convertir nombre de la clase CamelCase a PascalCase
    let classNameCamel = nameComponent!;
    // Convertir nombre de la clase CamelCase a kebab-case
    let classNameKebab = classNameCamel.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    // Verificar si el primer caracter de classNameKebab es un guion ( - )
    if (classNameKebab.charAt(0) === '-') {
      classNameKebab = classNameKebab.substring(1);
    }
    // Convertir nombre de la clase CamelCase a snake_case
    //let classNameSnake = classNameCamel.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase();

    // Get properties by class
    let classProperty: ClassData = getPropertiesByClass(tree, _options.name);

    // Create HTML file
    createFileWithTemplate(tree, __dirname, `${path}/${classNameKebab}/${classNameKebab}.component.html`, '__class__.component.html.template', {
      'className': classNameKebab
    });

    // Create SCSS file
    createFileWithTemplate(tree, __dirname, `${path}/${classNameKebab}/${classNameKebab}.component.scss`, '__class__.component.scss.template', {
      'className': classNameKebab
    });

    // Generate content for columns variable
    let columns = '';
    classProperty.properties.forEach((property) => {
      columns += `{ field: '${property}', title: '${property}' },
        `;
    });
    columns += "{ field: 'actions', title: 'Actions' }";

    // Create TS file
    createFileWithTemplate(tree, __dirname, `${path}/${classNameKebab}/${classNameKebab}.component.ts`, '__class__.component.ts.template', {
      'className': classNameKebab,
      'classNameCamel': classNameCamel,
      'columns': columns
    });

    return tree;
  };
}
