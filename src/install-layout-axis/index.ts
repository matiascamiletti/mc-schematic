import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { runCommand } from '../core/run-command';
import { addRoute } from '../core/add-route';
import { getContentByFile } from '../core/get-content-by-file';
import { addSourceInStyles } from '../core/add-source-in-styles';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function install(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Install the required dependencies
    runCommand('npm install --save @mckit/layout-core @mckit/layout @mckit/layout-axis', _context);

    // Config SCSS
    addSourceInStyles(tree, `
@source "../node_modules/@mckit/layout-core";
@source "../node_modules/@mckit/layout";
@source "../node_modules/@mckit/layout-axis";
`);

    // Add Route
    addRoute(`{
    path: '',
    component: MCAxisLayoutComponent,
    //canActivate: [mcAuthGuard],
    children: []
  },`, tree, _context, `import { MCAxisLayoutComponent } from '@mckit/layout-axis';`);

    // Generate Footer component
    runCommand('ng g c layout/footer --type=component', _context);

    // Replace App Component
    const component = getContentByFile(__dirname, 'app.ts.template');
    const appTsPath = tree.exists('src/app/app.ts') ? 'src/app/app.ts' : 'src/app/app.component.ts';
    if (tree.exists(appTsPath)) {
      tree.overwrite(appTsPath, component ?? '');
    }

    return tree;
  };
}
