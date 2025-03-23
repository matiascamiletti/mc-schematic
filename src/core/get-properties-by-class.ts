import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export interface ClassData {
    name: string;
    properties: string[];
}

export function getPropertiesByClass(tree: Tree, filePath: string): ClassData {

    const file = tree.read(filePath);
    if (!file) {
      throw new Error(`El archivo ${filePath} no existe.`);
    }

    const fileContent = file.toString('utf-8');

    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    let firstClass: ClassData | null = null;

    ts.forEachChild(sourceFile, (node) => {
        if (!firstClass && ts.isClassDeclaration(node) && node.name) {
            const className = node.name.text;
            const properties: string[] = [];

            node.members.forEach((member) => {
                if (ts.isPropertyDeclaration(member) && member.name) {
                    properties.push(member.name.getText());
                }
            });

            firstClass = { name: className, properties };
        }
    });

    if(firstClass == undefined||firstClass == null){
        throw new Error(`No se encontró ninguna clase en el archivo ${filePath}`);
    }

    return firstClass;
}