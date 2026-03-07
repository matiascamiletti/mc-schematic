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
    runCommand('npm install --save @mckit/auth @mckit/filter @mckit/form @mckit/odata @mckit/table @mckit/tenant', _context);

    // Config SCSS
    addSourceInStyles(tree, `
@source "../node_modules/@mckit/auth";
@source "../node_modules/@mckit/table";
@source "../node_modules/@mckit/odata";
@source "../node_modules/@mckit/table";
@source "../node_modules/@mckit/tenant";
`);

    // Replace App Component
    tree.overwrite('src/app/app.component.ts', getContentByFile(__dirname, 'app.component.ts.template') ?? '');

    // Create Footer Layout
    tree.overwrite('src/app/shared/components/footer-layout/footer-layout.component.scss', '');
    tree.overwrite('src/app/shared/components/footer-layout/footer-layout.component.html', getContentByFile(__dirname, 'footer-layout.component.html.template') ?? '');
    tree.overwrite('src/app/shared/components/footer-layout/footer-layout.component.ts', getContentByFile(__dirname, 'footer-layout.component.ts.template') ?? '');

    // Create Tenant form modal
    tree.overwrite('src/app/features/tenant/modals/tenant-create-form.service.ts', getContentByFile(__dirname, 'tenant-create-form.service.ts.template') ?? '');

    // Create No tenant page
    tree.overwrite('src/app/features/tenant/pages/no-tenant-page/no-tenant-page.component.html', getContentByFile(__dirname, 'no-tenant-page.component.html.template') ?? '');
    tree.overwrite('src/app/features/tenant/pages/no-tenant-page/no-tenant-page.component.ts', getContentByFile(__dirname, 'no-tenant-page.component.ts.template') ?? '');

    // Add Route
    addRoute(`{
        path: 'login',
        loadComponent: () => import('./features/auth/pages/sign-in-page/sign-in-page.component').then(m => m.SignInPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/sign-up-page/sign-up-page.component').then(m => m.SignUpPage)
  },
  {
    path: 'no-tenant',
    canActivate: [mcAuthGuard],
    loadComponent: () => import('./features/tenant/pages/no-tenant-page/no-tenant-page.component').then(m => m.NoTenantPageComponent)
  },
  {
    path: '',
    component: MCFuseLayoutComponent,
    canActivate: [mcAuthGuard, tenantListGuard],
    children: []
  },`, tree, _context, `import { tenantListGuard } from '@mckit/tenant';
import { mcAuthGuard } from '@mckit/auth';
import { MCFuseLayoutComponent } from '@mckit/layout-fuse';`);

    return tree;
  };
}
