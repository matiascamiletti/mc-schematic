import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { runCommand } from '../core/run-command';
import { createFileWithTemplate } from '../core/create-file-with-template';
import { ClassData, getPropertiesByClass } from '../core/get-properties-by-class';

interface SchemaOptions {
  name: string;
}

export function createCrud(_options: SchemaOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    if (!_options.name) {
      throw new Error('El parámetro "name" es obligatorio.');
    }

    // Install the required dependencies
    runCommand('npm install --save @mckit/table @mckit/odata @mckit/filter @mckit/layout-core @mckit/form', _context);

    // Config base path for features
    const className = _options.name;
    const featureName = _options.name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    const featurePath = 'src/app/features/' + featureName;

    // Create service
    createFileWithTemplate(tree, __dirname, `${featurePath}/services/${featureName}.service.ts`, '__class__.service.ts.template', {
      'kebabName': featureName,
      'classNameCamel': className
    });

    // Get properties by class
    let classProperty: ClassData = getPropertiesByClass(tree, _options.name);

    // Generate content for fields variable
    let fields = '';
    classProperty.properties.forEach((property) => {

      if (property == 'id') {
        fields += `HiddenField.init('id', 'Id'),
        `;
      } else {
        fields += `IftaTextField.init('${property}', '${property}'),
        `;
      }
    });

    // Create form modal
    createFileWithTemplate(tree, __dirname, `${featurePath}/modals/${featureName}-form.modal.ts`, '__class__-form.modal.ts.template', {
      'kebabName': featureName,
      'classNameCamel': className,
      'fields': fields
    });

    // Create HTML file
    createFileWithTemplate(tree, __dirname, `${featurePath}/pages/${featureName}-list-page/${featureName}-list-page.html`, '__class__.component.html.template', {
      'kebabName': featureName,
      'classNameCamel': className
    });

    // Create SCSS file
    createFileWithTemplate(tree, __dirname, `${featurePath}/pages/${featureName}-list-page/${featureName}-list-page.scss`, '__class__.component.scss.template', {
      'className': featureName
    });

    // Generate content for columns variable
    let columns = '';
    classProperty.properties.forEach((property) => {
      columns += `{ field: '${property}', title: '${property}', isShow: true, isSortable: true },
        `;
    });
    columns += "{ field: 'actions', title: 'Actions', isShow: true, isSortable: false }";

    // Create TS file
    createFileWithTemplate(tree, __dirname, `${featurePath}/pages/${featureName}-list-page/${featureName}-list-page.ts`, '__class__.component.ts.template', {
      'kebabName': featureName,
      'classNameCamel': className,
      'columns': columns
    });

    return tree;
  };
}
