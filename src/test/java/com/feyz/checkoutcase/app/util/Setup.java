package com.feyz.checkoutcase.app.util;

// import org.slf4j.LoggerFactory;
// import org.slf4j.event.Level;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.feyz.checkoutcase.app.Application;
// import com.feyz.checkoutcase.app.cart.CartAggragate;
// import com.feyz.checkoutcase.app.cli_commands.StartCommand;
// import com.feyz.checkoutcase.app.services.CommandExecuter;
// import com.feyz.checkoutcase.app.services.CommandReaderAndResultWriter;
import com.feyz.checkoutcase.app.services.Rules;

// import ch.qos.logback.classic.Level;

public class Setup {

    public static InnerSetup init() {
        var applicationContext = new AnnotationConfigApplicationContext(Application.class);

        // var logger = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(Application.class);
        // logger.setLevel(Level.OFF);
        // logger.info("SET INFO LEVEL");
        // logger.debug("<- Feyz Error ->");
        // ch.qos.logback.classic.Logger rootLogger = (ch.qos.logback.classic.Logger) LoggerFactory
        //         .getLogger(ch.qos.logback.classic.Logger.ROOT_LOGGER_NAME);
        // rootLogger.setLevel(Level.OFF);

        var testUtil = new TestUtil();
        var rules = new Rules();
        var autowireCapableBeanFactory = applicationContext.getAutowireCapableBeanFactory();
        autowireCapableBeanFactory.autowireBean(testUtil);
        autowireCapableBeanFactory.autowireBean(rules);
        return new InnerSetup(applicationContext, autowireCapableBeanFactory, testUtil, rules);
    }

    public static class InnerSetup {
        public AnnotationConfigApplicationContext applicationContext;
        public TestUtil testUtil;
        public Rules rules;
        public AutowireCapableBeanFactory autowireCapableBeanFactory;

        public InnerSetup(AnnotationConfigApplicationContext c, AutowireCapableBeanFactory bf, TestUtil tu, Rules r) {
            this.applicationContext = c;
            this.testUtil = tu;
            this.autowireCapableBeanFactory = bf;
            this.rules = r;
        }
    }
}
