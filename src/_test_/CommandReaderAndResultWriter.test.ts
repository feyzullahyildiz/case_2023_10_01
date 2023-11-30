import path from 'node:path';
import fs from 'fs';
import { CommandReaderAndResultWriter } from '../app/CommandReaderAndResultWriter';

const outputFolder = path.resolve(__dirname, 'output_folder');
const inputFilePath = path.resolve(__dirname, 'myInputFile.txt');
const outputFilePath = path.resolve(outputFolder, 'test_output.txt');
describe('CommandReaderAndResultWriter', () => {
  beforeEach(() => {
    if (fs.existsSync(outputFolder)) {
      fs.rmSync(outputFolder, { recursive: true });
    }
  });
  it('should add an item looks like VAS', () => {
    const writer = new CommandReaderAndResultWriter(inputFilePath, outputFilePath);
    expect(fs.existsSync(outputFilePath)).toBe(false);
    writer.start();
    expect(fs.existsSync(outputFilePath)).toBe(true);
  });
});
