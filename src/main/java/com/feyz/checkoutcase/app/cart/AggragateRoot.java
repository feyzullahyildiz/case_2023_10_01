package com.feyz.checkoutcase.app.cart;

import java.util.ArrayList;
import java.util.UUID;

import com.feyz.checkoutcase.app.command_results.BaseCommandResult;
import com.feyz.checkoutcase.app.commands.BaseCommand;
import com.feyz.checkoutcase.app.events.BaseEvent;

public abstract class AggragateRoot {
    private ArrayList<BaseEvent<?, ?, ?>> events;
    private String uuid;

    public AggragateRoot() {
        this.uuid = UUID.randomUUID().toString();
        this.events = new ArrayList<>();
    }

    public AggragateRoot(ArrayList<BaseEvent<?, ?, ?>> events) {
        this.uuid = UUID.randomUUID().toString();
        this.events = new ArrayList<>();
        for (BaseEvent<?, ?, ?> event : events) {
            this.commitEvent(event);
        }
    }

    public String getUUID() {
        return this.uuid;
    }

    public <T extends BaseCommand<P>, U extends BaseCommandResult<?>, P> U commitEvent(BaseEvent<T, U, P> event) {
        var res = event.commitEvent(uuid);
        if (event.isCRUD()) {
            this.events.add(event);
        }
        return res;
    }

    public <T extends BaseCommand<P>, U extends BaseCommandResult<?>, P> U tryAndCommitEvent(BaseEvent<T, U, P> event) {
        var tryResult = event.tryEvent(this.getChanges());
        if (tryResult != null && !tryResult.isSuccess()) {
            return tryResult;
        }

        var res = event.commitEvent(uuid);
        if (event.isCRUD()) {
            this.events.add(event);
        }
        return res;
    }

    public ArrayList<BaseEvent<?, ?, ?>> getChanges() {
        return (ArrayList<BaseEvent<?, ?, ?>>) this.events.clone();
    }
}
