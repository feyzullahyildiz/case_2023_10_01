package com.feyz.checkoutcase.app.services;

import com.feyz.checkoutcase.app.commands.AddItemCommand;
import com.feyz.checkoutcase.app.commands.AddVasItemToItemCommand;
import com.feyz.checkoutcase.app.commands.BaseCommand;
import com.feyz.checkoutcase.app.commands.DisplayCartCommand;
import com.feyz.checkoutcase.app.commands.RemoveItemCommand;
import com.feyz.checkoutcase.app.commands.ResetCartCommand;
import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.command_results.ErrorCommandResult;
import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.stereotype.Service;

@Service
public class CommandReaderAndResultWriter {

    @Autowired
    private AutowireCapableBeanFactory beanFactory;

    public void start(Path inputPath, Path outputPath) throws IOException {
        this.prapare(inputPath, outputPath);
        var commandsInStr = Files.readString(inputPath);
        var lines = commandsInStr.split("\n");
        var executer = new CommandExecuter(beanFactory);
        for (var jsonString : lines) {
            var command = this.getCommandFromString(jsonString.trim());
            if (command != null) {
                var result = executer.execute(command);
                this.appendResultToFile(result, outputPath);
            }
        }
    }

    private void prapare(Path inputPath, Path outputPath) throws IOException {
        var hasInputFile = Files.exists(inputPath);
        if (!hasInputFile) {
            var message = String.format("input file not found at: %s", inputPath.toAbsolutePath().toString());
            throw new IOException(message);
        }
        var hasOutputFile = Files.exists(outputPath);
        if (hasOutputFile) {
            Files.delete(outputPath);
        }
        Files.createFile(outputPath);
    }

    private BaseCommand<?> getCommandFromString(String str) {
        var gson = new GsonBuilder().serializeNulls().create();
        try {
            var commandText = gson.fromJson(str, BaseCommand.class).getCommand();
            if (commandText.equals("addItem")) {
                return gson.fromJson(str, AddItemCommand.class);
            }
            if (commandText.equals("addVasItemToItem")) {
                return gson.fromJson(str, AddVasItemToItemCommand.class);
            }
            if (commandText.equals("resetCart")) {
                return gson.fromJson(str, ResetCartCommand.class);
            }
            if (commandText.equals("removeItem")) {
                return gson.fromJson(str, RemoveItemCommand.class);
            }
            if (commandText.equals("displayCart")) {
                return gson.fromJson(str, DisplayCartCommand.class);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private String getJsonTextFromCommand(BaseCommandResult<?> result) {
        if (result.isSuccess()) {
            var gson = new GsonBuilder().serializeNulls().setExclusionStrategies(new ExclusionStrategy() {
                @Override
                public boolean shouldSkipClass(Class<?> clazz) {
                    return false;
                }

                @Override
                public boolean shouldSkipField(FieldAttributes f) {
                    return f.getName().equals("errorMessage");
                }
            }).create();
            return gson.toJson(result);
        }
        var gson = new GsonBuilder().serializeNulls().create();
        return gson.toJson(new ErrorCommandResult(result.getErrorMessage()));
    }

    private void appendResultToFile(BaseCommandResult<?> result, Path outputPath) throws IOException {
        String str = this.getJsonTextFromCommand(result) + "\n";
        System.out.print(str);
        Files.writeString(outputPath, str, StandardOpenOption.APPEND);
    }
}
