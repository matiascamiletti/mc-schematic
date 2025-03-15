import { Tree } from '@angular-devkit/schematics';
import { insertStringAt } from './insert-string-at';

export function addSourceInStyles(tree: Tree, sourceText: string) {
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
    const updatedContent = insertStringAt(content, sourceText, sourceEndPosition + 1);

    tree.overwrite(filePath, updatedContent);
}