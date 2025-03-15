import { SchematicContext } from '@angular-devkit/schematics';
import { execSync } from 'child_process';

export function runCommand(command: string, _context: SchematicContext) {

  try {
    const stdout = execSync(command, { encoding: 'utf-8' });
    _context.logger.info(`✅ Result: ${stdout}`);
  } catch (error) {
    _context.logger.error(`Error: ${error.message}`);
  }

}