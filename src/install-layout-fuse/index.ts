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
    runCommand('npm install --save @mckit/layout-core @mckit/layout @mckit/layout-fuse', _context);
  
    // Config SCSS
    addSourceInStyles(tree, `
@source "../node_modules/@mckit/layout-core";
@source "../node_modules/@mckit/layout";
@source "../node_modules/@mckit/layout-fuse";
`);

    // Add Route
    addRoute(`{
    path: '',
    component: MCFuseLayoutComponent,
    //canActivate: [mcAuthGuard],
    children: []
  },`, tree, _context, `import { MCFuseLayoutComponent } from '@mckit/layout-fuse';`);

    // Generate Footer component
    runCommand('ng g c layout/footer', _context);

    // Replace App Component
    const component = getContentByFile(__dirname, 'app.component.ts.template');
    tree.overwrite('src/app/app.component.ts', component ?? '');

    return tree;
  };
}
