package com.feyz.checkoutcase.app.events;

import java.util.ArrayList;

import org.springframework.beans.factory.config.AutowireCapableBeanFactory;

import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.commands.BaseCommand;
import com.feyz.checkoutcase.app.eventhandler.BaseEventHandler;

enum BaseEventType {
  READONLY,
  CRUD,
}

public abstract class BaseEvent<C extends BaseCommand<P>, R extends BaseCommandResult<?>, P> {
  private C command;
  private BaseEventType eventType;

  public BaseEvent(AutowireCapableBeanFactory beanFactory, C command, BaseEventType eventType) {
    beanFactory.autowireBean(this);
    this.command = command;
    this.eventType = eventType;
  }

  public C getCommand() {
    return this.command;
  }

  public P getPayload() {
    return this.getCommand().getPayload();
  }
  public boolean isCRUD() {
    return this.eventType == BaseEventType.CRUD;
  }

  abstract protected BaseEventHandler<BaseEvent<C, R, P>, C, R, P> getHandler();

  public R tryEvent(ArrayList<BaseEvent<?, ?, ?>> actualEvents) {
    var handler = this.getHandler();
    return handler.onTry(this, actualEvents);
  }

  public R commitEvent(String uuid) {
    var handler = this.getHandler();
    return handler.onCommit(uuid, this);
  }
}
