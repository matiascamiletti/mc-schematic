import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { runCommand } from '../core/run-command';
import { addRoute } from '../core/add-route';
import { getContentByFile } from '../core/get-content-by-file';


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

  if (!content.includes('@use "tailwindcss";')) {
    return;
  }

  // Search last @source
  const sourcePosition = content.lastIndexOf('@source');
  // Search last ;
  const sourceEndPosition = content.indexOf(';', sourcePosition);
  // Add the new @source after the last @source
  const updatedContent = insertStringAt(content, `
@source "../node_modules/@mckit/auth";
`, sourceEndPosition + 1);

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
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideMCAuth, authInterceptor} from '@mckit/auth';

import { environment } from '../environments/environment';`, importEndPosition + 1);

  // Replace the zoneChangeDetectionStrategy
  content = content.replace('provideZoneChangeDetection({ eventCoalescing: true }),', `provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideMCAuth({
      baseUrl: environment.baseUrl
    }),`);

  tree.overwrite(filePath, content);
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function addLoginPage(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    // Install the required dependencies
    runCommand('npm install --save @ngx-pwa/local-storage@19 @mckit/auth', _context);

    // Generate environments
    runCommand('ng g environments', _context);

    // Config SCSS
    processStyles(tree, _context); 

    // Add Route
    addRoute(`{
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
      },`, tree, _context);

    // Config app.config.ts
    processAppConfig(tree, _context);

    // Generate component
    runCommand('ng g c features/auth/pages/login-page', _context);

    // Add html
    tree.overwrite('src/app/features/auth/pages/login-page/login-page.component.html', `<mc-auth-sakai #authComp [config]="config" (submit)="onLogin($event)" (action)="onAction($event)" />`);

    // Add Component
    const component = getContentByFile(__dirname, 'login-page.component.ts.template');
    tree.overwrite('src/app/features/auth/pages/login-page/login-page.component.ts', component ?? '');

    return tree;
  };
}
