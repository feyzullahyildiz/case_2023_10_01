package com.feyz.checkoutcase.app.cli_commands;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.shell.standard.ShellOption;

import com.feyz.checkoutcase.app.services.CommandReaderAndResultWriter;

import java.io.IOException;
import java.nio.file.Paths;

@ShellComponent
public class StartCommand {

    @Autowired
    CommandReaderAndResultWriter commandReaderAndResultWriter;

    @Autowired
    AutowireCapableBeanFactory beanFactory;

    @ShellMethod(key = "start", value = "I will execute input file and log into the output file")
    public void start(@ShellOption(value = "input", defaultValue = "input.txt", help = "input file path") String input,
            @ShellOption(value = "output", defaultValue = "output.txt", help = "output file path") String output) {

        var cwd = System.getProperty("user.dir");
        var inputPath = Paths.get(cwd, input);
        var outputPath = Paths.get(cwd, output);
        try {
            System.out.println("COMMAND READER-WRITER STARTED");
            commandReaderAndResultWriter.start(inputPath, outputPath);
            System.out.println("COMMAND READER-WRITER COMPLETED SUCCESSFULLY");
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("COMMAND READER-WRITER COMPLETED FAILED");
            System.out.println(e);
        }
    }
}
