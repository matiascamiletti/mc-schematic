import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('init', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematic('init', {}, Tree.empty());

    expect(tree.files[0]).toEqual('/.postcssrc.json');
    expect(tree.files.length).toEqual(1);
  });
});
