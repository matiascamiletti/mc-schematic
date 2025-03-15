import { SchematicContext, Tree } from '@angular-devkit/schematics';

export function addRoute(routeText: string, tree: Tree, context: SchematicContext, importsText: string|undefined = undefined) {
    const filePath = 'src/app/app.routes.ts';

    if (!tree.exists(filePath)) {
        context.logger.error(`❌ No se encontró ${filePath}`);
        return tree;
    }

    const content = tree.read(filePath)?.toString('utf-8') || '';

    let updatedContent = content.replace(/\[\s*([\s\S]*?)\s*\]/, (_, routes) => {
        return `[${routes.trim() ? routes.trim() + ', ' : ''}${routeText}]`;
    });

    if(importsText != undefined){
        updatedContent = importsText + '\n' + updatedContent;
    }

    tree.overwrite(filePath, updatedContent);
}