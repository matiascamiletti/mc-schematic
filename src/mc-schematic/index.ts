import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function mcSchematic(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Aquí puedes definir la lógica para generar archivos o modificar el proyecto
    //tree.create('hello.txt', 'Hello, World!');
    return tree;
  };
}
