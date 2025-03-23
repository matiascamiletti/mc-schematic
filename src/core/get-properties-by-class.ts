import { Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export interface ClassData {
    name: string;
    path: string;
    properties: string[];
}

export function getPropertiesByClass(tree: Tree, className: string): ClassData {

    let classFilePath: string|undefined;
    let properties: string[] = [];

    tree.visit((filePath) => {
        if (!filePath.endsWith('.ts')) return;

        const file = tree.read(filePath);
        if (!file) return;

        const fileContent = file.toString('utf-8');
        const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

        ts.forEachChild(sourceFile, (node) => {
            if (ts.isClassDeclaration(node) && node.name?.text === className) {
                classFilePath = filePath;

                node.members.forEach((member) => {
                    if (ts.isPropertyDeclaration(member) && member.name) {
                        properties.push(member.name.getText());
                    }
                });
            }
        });
    });

    if(classFilePath == undefined){
        throw new Error(`No se encontró la clase ${className} en ningún archivo.`);
    }

    return {
        name: className,
        path: classFilePath,
        properties
    };
}