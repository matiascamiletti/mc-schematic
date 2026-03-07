import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { runCommand } from '../core/run-command';
import { addRoute } from '../core/add-route';
import { getContentByFile } from '../core/get-content-by-file';
import { addSourceInStyles } from '../core/add-source-in-styles';
import { insertStringAt } from '../core/insert-string-at';

function processAppConfig(tree: Tree, _context: SchematicContext) {
  const filePath = 'src/app/app.config.ts';

  if (!tree.exists(filePath)) {
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
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { authInterceptor, provideMCAuth } from '@mckit/auth';

import { tenantInterceptor } from '@mckit/tenant';

import { environment } from '../environments/environment';`, importEndPosition + 1);

  // Replace the zoneChangeDetectionStrategy
  content = content.replace('provideZoneChangeDetection({ eventCoalescing: true }),', `provideZoneChangeDetection({ eventCoalescing: true }),
    provideMCAuth({
      baseUrl: environment.baseUrl
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, tenantInterceptor])
    ),,`);

  tree.overwrite(filePath, content);
}

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
    tree.overwrite('src/app/app.ts', getContentByFile(__dirname, 'app.ts.template') ?? '');

    // Create Footer Layout
    tree.create('src/app/shared/components/footer-layout/footer-layout.component.scss', '');
    tree.create('src/app/shared/components/footer-layout/footer-layout.component.html', getContentByFile(__dirname, 'footer-layout.component.html.template') ?? '');
    tree.create('src/app/shared/components/footer-layout/footer-layout.component.ts', getContentByFile(__dirname, 'footer-layout.component.ts.template') ?? '');

    // Create Tenant form modal
    tree.create('src/app/features/tenant/modals/tenant-create-form.service.ts', getContentByFile(__dirname, 'tenant-create-form.service.ts.template') ?? '');

    // Create No tenant page
    tree.create('src/app/features/tenant/pages/no-tenant-page/no-tenant-page.component.html', getContentByFile(__dirname, 'no-tenant-page.component.html.template') ?? '');
    tree.create('src/app/features/tenant/pages/no-tenant-page/no-tenant-page.component.ts', getContentByFile(__dirname, 'no-tenant-page.component.ts.template') ?? '');

    // Create Login page
    tree.create('src/app/features/auth/pages/sign-in-page/sign-in-page.component.scss', '');
    tree.create('src/app/features/auth/pages/sign-in-page/sign-in-page.component.html', getContentByFile(__dirname, 'sign-in-page.component.html.template') ?? '');
    tree.create('src/app/features/auth/pages/sign-in-page/sign-in-page.component.ts', getContentByFile(__dirname, 'sign-in-page.component.ts.template') ?? '');

    // Create Register page
    tree.create('src/app/features/auth/pages/sign-up-page/sign-up-page.component.scss', '');
    tree.create('src/app/features/auth/pages/sign-up-page/sign-up-page.component.html', getContentByFile(__dirname, 'register-page.component.html.template') ?? '');
    tree.create('src/app/features/auth/pages/sign-up-page/sign-up-page.component.ts', getContentByFile(__dirname, 'register-page.component.ts.template') ?? '');

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

    // Config app.config.ts
    processAppConfig(tree, _context);

    return tree;
  };
}
