package com.feyz.checkoutcase.app.services;

import com.feyz.checkoutcase.app.commands.AddItemCommand;
import com.feyz.checkoutcase.app.commands.AddVasItemToItemCommand;
import com.feyz.checkoutcase.app.commands.BaseCommand;
import com.feyz.checkoutcase.app.commands.DisplayCartCommand;
import com.feyz.checkoutcase.app.commands.RemoveItemCommand;
import com.feyz.checkoutcase.app.commands.ResetCartCommand;

import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.cart.CartAggragate;
import com.feyz.checkoutcase.app.command_results.AddItemCommandResult;
import com.feyz.checkoutcase.app.command_results.AddVasItemToItemCommandResult;
import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.command_results.DisplayCartCommandResult;
import com.feyz.checkoutcase.app.command_results.RemoveItemCommandResult;
import com.feyz.checkoutcase.app.command_results.ResetCartCommandResult;

public class CommandExecuter {

    private CartAggragate cartAggragate;

    public CommandExecuter(AutowireCapableBeanFactory beanFactory) {
        beanFactory.autowireBean(this);
        cartAggragate = new CartAggragate(beanFactory);
    }

    public BaseCommandResult<?> execute(BaseCommand<?> command) {
        if (command instanceof AddItemCommand) {
            return this.addItem((AddItemCommand) command);
        }
        if (command instanceof AddVasItemToItemCommand) {
            return this.addVasItemToItem((AddVasItemToItemCommand) command);
        }
        if (command instanceof ResetCartCommand) {
            return this.resetCart((ResetCartCommand) command);
        }
        if (command instanceof RemoveItemCommand) {
            return this.removeItem((RemoveItemCommand) command);
        }
        if (command instanceof DisplayCartCommand) {
            return this.displayCart((DisplayCartCommand) command);
        }
        return null;
    }

    private AddItemCommandResult addItem(AddItemCommand command) {
        return this.cartAggragate.addItem(command);
    }

    private AddVasItemToItemCommandResult addVasItemToItem(AddVasItemToItemCommand command) {
        return this.cartAggragate.addVasItemToItem(command);
    }

    private RemoveItemCommandResult removeItem(RemoveItemCommand command) {
        return this.cartAggragate.removeItem(command);
    }

    private ResetCartCommandResult resetCart(ResetCartCommand command) {
        return this.cartAggragate.resetCart(command);
    }

    private DisplayCartCommandResult displayCart(DisplayCartCommand command) {
        return this.cartAggragate.displayCart(command);
    }
}
