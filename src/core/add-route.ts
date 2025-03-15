import { SchematicContext, Tree } from '@angular-devkit/schematics';

export function addRoute(routeText: string, tree: Tree, context: SchematicContext) {
    const filePath = 'src/app/app.routes.ts';

    if (!tree.exists(filePath)) {
        context.logger.error(`❌ No se encontró ${filePath}`);
        return tree;
    }

    const content = tree.read(filePath)?.toString('utf-8') || '';

    const updatedContent = content.replace(/\[\s*([\s\S]*?)\s*\]/, (_, routes) => {
        return `[${routes.trim() ? routes.trim() + ', ' : ''}${routeText}]`;
    });

    tree.overwrite(filePath, updatedContent);

    context.logger.info(`✅ Ruta añadida correctamente`);
}