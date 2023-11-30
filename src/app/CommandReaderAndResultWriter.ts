import fs from 'node:fs';
import path from 'node:path';
import { CommandExecuter } from './CommandExecuter';
export class CommandReaderAndResultWriter {
  constructor(
    private inputPath: string,
    private outputPath: string,
  ) {}
  public start() {
    const inputFileExists = fs.existsSync(this.inputPath);
    if (!inputFileExists) {
      throw new Error(`input file not found: ${this.inputPath}`);
    }
    const commandList = this.parseInputFile();
    this.reCreateOutputFile();
    const executer = new CommandExecuter();
    for (const command of commandList) {
      const response = executer.execute(command);
      this.appendResultToOutputFile(JSON.stringify(response));
    }
  }

  private parseInputFile() {
    const text = fs.readFileSync(this.inputPath, { encoding: 'utf-8' });
    const lineCommands = text
      .split('\n')
      .map((str) => str.trim())
      .filter((str) => str)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          console.log('JSON.parse syntax error');
          return null;
        }
      })
      .filter((val) => val);
    return lineCommands;
  }
  private reCreateOutputFile() {
    const folderPath = path.dirname(this.outputPath);
    fs.mkdirSync(folderPath, { recursive: true });
    const exists = fs.existsSync(this.outputPath);
    if (!exists) {
      return;
    }
    fs.writeFileSync(this.outputPath, Buffer.from(''));
  }
  private appendResultToOutputFile(str: string) {
    fs.appendFileSync(this.outputPath, str + '\n');
  }
}
