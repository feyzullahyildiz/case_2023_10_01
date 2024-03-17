package com.feyz.checkoutcase.app.eventhandler;

import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.commands.BaseCommand;
import com.feyz.checkoutcase.app.events.BaseEvent;

import java.util.ArrayList;

public abstract class  BaseEventHandler<E extends BaseEvent<C, R, P>, C extends BaseCommand<P>, R extends BaseCommandResult<?>, P> {
    abstract public R onTry(E event, ArrayList<BaseEvent<?, ?, ?>> actualEvents);

    abstract public R onCommit(String uuid, E event);
}
