package com.feyz.checkoutcase.app.repository;

import java.util.HashMap;
import java.util.Map;


public abstract class BaseRepository<T> {

    private Map<String, T> map = new HashMap<String, T>();

    protected void add(String id, T item) {
        this.map.put(id, item);
    }
    protected void remove(String id) {
        this.map.remove(id);
    }

    protected T get(String id) {
        return this.map.get(id);
    }

    protected void clear() {
        this.map.clear();
    }
}
