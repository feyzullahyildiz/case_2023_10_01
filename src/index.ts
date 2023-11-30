import { Command as CliCommandReader } from 'commander';
import { CommandReaderAndResultWriter } from './app/CommandReaderAndResultWriter';
import path from 'path';

const cliProgram = new CliCommandReader();

cliProgram.option('-i, --input <string>', 'input file path').option('-o, --output <string>', 'output file path');

const cliOptions = cliProgram.parse();
const inputFilePath = path.resolve(process.cwd(), cliOptions.opts().input || 'myInputFile.txt');
const outputFilePath = path.resolve(process.cwd(), cliOptions.opts().output || 'myOutputFile.txt');

console.log('inputFilePath', inputFilePath);
console.log('outputFilePath', outputFilePath);
const commandReaderAndResultWriter = new CommandReaderAndResultWriter(inputFilePath, outputFilePath);
try {
  console.log('STARTED');
  commandReaderAndResultWriter.start();
  console.log('DONE');
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
