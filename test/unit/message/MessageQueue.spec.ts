import { expect } from 'chai';
import { SinonSpy, spy } from 'sinon';
import { MessageQueue as API } from '../../../lib';
import { IMessage } from '../../../src/interface/IMessage';
import { IPublisher } from '../../../src/interface/IPublisher';
import { MessageQueue } from '../../../src/message/MessageQueue';
import { Topic } from '../../../src/type/Topic';
import { MockContent } from '../mock/MockContent';
import { MockPublisher } from '../mock/MockPublisher';
import { MockSubscriber } from '../mock/MockSubscriber';

describe('MessageQueue test suite', () => {

    const factory        = (name? : string) => () => new MessageQueue(name);
    const messageFactory = (topic : Topic) => ({
        topic     : topic,
        publisher : publisher,
        content   : {
            attribute : 'value',
        },
    });
    const name           = 'Command';
    const topic1         = 'namespace/topic1';
    const topic2         = 'namespace/topic2';
    const topic3         = 'namespace/topic3';

    const publisher : IPublisher<MockContent> = new MockPublisher<MockContent>();

    describe('Instantiation', () => {

        it('should instantiate without error (no parameter)', () => {
            expect(factory()).to.not.throw();
        });

        it('should instantiate without error (1 parameter)', () => {
            expect(factory(name)).to.not.throw();
        });

    });

    describe('Runtime', () => {

        let messageQueue : MessageQueue;

        describe('Initialization (no parameter)', () => {

            beforeEach(() => {
                messageQueue = factory()();
            });

            it('should initialize name property', () => {
                expect(messageQueue.name).to.equal('Topic');
            });

            it('should have subscribers property to be an instance of Map', () => {
                expect(messageQueue.subscribers).to.be.an.instanceOf(Map);
            });

            it('should initialize subscribers property with no element', () => {
                expect(messageQueue.subscribers.size).to.equal(0);
            });

        });

        describe('Initialization (1 parameter)', () => {

            beforeEach(() => {
                messageQueue = factory(name)();
            });

            it('should initialize name property', () => {
                expect(messageQueue.name).to.equal(name);
            });

            it('should have subscribers property to be an instance of Map', () => {
                expect(messageQueue.subscribers).to.be.an.instanceOf(Map);
            });

            it('should initialize subscribers property with no element', () => {
                expect(messageQueue.subscribers.size).to.equal(0);
            });

        });

        describe('subscribe method', () => {

            beforeEach(() => {
                messageQueue = factory()();
            });

            it('should return itself', () => {
                expect(messageQueue.subscribe(new MockSubscriber(topic1))).to.equal(messageQueue);
            });

            it('should add subscriber in a new key and increase size', () => {
                const subscriber = new MockSubscriber(topic1);

                expect(messageQueue.subscribers.size).to.equal(0);

                messageQueue.subscribe(subscriber);

                expect(messageQueue.subscribers.size).to.equal(1);
            });

            it('should add subscriber in a new key', () => {
                const subscriber = new MockSubscriber(topic1);

                expect(messageQueue.subscribers.has(topic1)).to.equal(false);

                messageQueue.subscribe(subscriber);

                expect(messageQueue.subscribers.has(topic1)).to.equal(true);
            });

            it('should add subscriber in a new key and create a new Set', () => {
                const subscriber = new MockSubscriber(topic1);

                messageQueue.subscribe(subscriber);

                expect(messageQueue.subscribers.get(topic1)).to.be.an.instanceOf(Set);
            });

            it('should add subscriber in a new key and create a new Set with subscriber and increase size', () => {
                const subscriber = new MockSubscriber(topic1);

                messageQueue.subscribe(subscriber);

                expect(messageQueue.subscribers.get(topic1).size).to.equal(1);
            });

            it('should add subscriber in a new key and create a new Set with subscriber', () => {
                const subscriber = new MockSubscriber(topic1);

                messageQueue.subscribe(subscriber);

                expect(messageQueue.subscribers.get(topic1).has(subscriber)).to.equal(true);
            });

            it('should add subscriber with different name without replacing old one and increase size', () => {
                const subscriber1 = new MockSubscriber(topic1);
                const subscriber2 = new MockSubscriber(topic2);

                messageQueue.subscribe(subscriber1);

                expect(messageQueue.subscribers.size).to.equal(1);

                messageQueue.subscribe(subscriber2);

                expect(messageQueue.subscribers.size).to.equal(2);
            });

            it('should add subscriber with different name without replacing old one', () => {
                const subscriber1 = new MockSubscriber(topic1);
                const subscriber2 = new MockSubscriber(topic2);

                messageQueue.subscribe(subscriber1);

                expect(messageQueue.subscribers.has(topic1)).to.equal(true);
                expect(messageQueue.subscribers.has(topic2)).to.equal(false);

                messageQueue.subscribe(subscriber2);

                expect(messageQueue.subscribers.has(topic1)).to.equal(true);
                expect(messageQueue.subscribers.has(topic2)).to.equal(true);
            });

            it('should add subscriber with different name without replacing old one and create a new Set', () => {
                const subscriber1 = new MockSubscriber(topic1);
                const subscriber2 = new MockSubscriber(topic2);

                messageQueue.subscribe(subscriber1);
                messageQueue.subscribe(subscriber2);

                expect(messageQueue.subscribers.get(topic2)).to.be.an.instanceOf(Set);
            });

            it('should add subscriber with different name without replacing old one and create a new Set with subscriber and increase size', () => {
                const subscriber1 = new MockSubscriber(topic1);
                const subscriber2 = new MockSubscriber(topic2);

                messageQueue.subscribe(subscriber1);
                messageQueue.subscribe(subscriber2);

                expect(messageQueue.subscribers.get(topic2).size).to.equal(1);
            });

            it('should add subscriber with different name without replacing old one and create a new Set with subscriber', () => {
                const subscriber1 = new MockSubscriber(topic1);
                const subscriber2 = new MockSubscriber(topic2);

                messageQueue.subscribe(subscriber1);
                messageQueue.subscribe(subscriber2);

                expect(messageQueue.subscribers.get(topic2).has(subscriber2)).to.equal(true);
            });

            it('should add subscriber but not create a new entry in subscribers if topic exists', () => {
                const subcriber1 = new MockSubscriber(topic1);
                const subcriber2 = new MockSubscriber(topic1);

                messageQueue.subscribe(subcriber1)
                            .subscribe(subcriber2);

                expect(messageQueue.subscribers.size).to.equal(1);
            });

            it('should add subscriber and be added to current topic Set if topic exists and increase size', () => {
                const subcriber1 = new MockSubscriber(topic1);
                const subcriber2 = new MockSubscriber(topic1);

                messageQueue.subscribe(subcriber1)
                            .subscribe(subcriber2);

                expect(messageQueue.subscribers.get(topic1).size).to.equal(2);
            });

            it('should add subscriber and be added to current topic Set if topic exists', () => {
                const subcriber1 = new MockSubscriber(topic1);
                const subcriber2 = new MockSubscriber(topic1);

                messageQueue.subscribe(subcriber1)
                            .subscribe(subcriber2);

                expect(messageQueue.subscribers.get(topic1).has(subcriber2)).to.equal(true);
            });

            it('should add subscriber and be added to current topic and not replace existing subscribers Set if topic exists', () => {
                const subcriber1 = new MockSubscriber(topic1);
                const subcriber2 = new MockSubscriber(topic1);

                messageQueue.subscribe(subcriber1)
                            .subscribe(subcriber2);

                expect(messageQueue.subscribers.get(topic1).has(subcriber1)).to.equal(true);
            });

        });

        describe('publish method', () => {

            let consoleWarnSpy : SinonSpy;

            const oldConsoleWarn = console.warn;

            before(() => {
                console.warn = function () {};
            });

            after(() => {
                console.warn = oldConsoleWarn;
            });

            let subscriberSpy1 : SinonSpy;
            let subscriberSpy2 : SinonSpy;
            let subscriberSpy3 : SinonSpy;

            beforeEach(() => {
                const subscriber1 = new MockSubscriber(topic1);
                const subscriber2 = new MockSubscriber(topic1);
                const subscriber3 = new MockSubscriber(topic2);

                subscriberSpy1 = spy(subscriber1, 'execute');
                subscriberSpy2 = spy(subscriber2, 'execute');
                subscriberSpy3 = spy(subscriber3, 'execute');
                consoleWarnSpy = spy(console, 'warn');

                messageQueue = factory()();

                messageQueue.subscribe(subscriber1)
                            .subscribe(subscriber2)
                            .subscribe(subscriber3);
            });

            afterEach(() => {
                subscriberSpy1.restore();
                subscriberSpy2.restore();
                subscriberSpy3.restore();
                consoleWarnSpy.restore();
            });

            it('should return itself', () => {
                const message : IMessage<MockContent> = messageFactory(topic1);

                expect(messageQueue.publish<MockContent>(message)).to.equal(messageQueue);
            });

            it('should warn if topic has no subscribers', () => {
                messageQueue.publish<MockContent>(messageFactory(topic3));

                expect(consoleWarnSpy.callCount).to.equal(1);
            });

            it('should do nothing if there is no subscribers for topic', () => {
                const message : IMessage<MockContent> = messageFactory(topic3);

                messageQueue.publish(message);

                expect(subscriberSpy1.notCalled).to.equal(true);
                expect(subscriberSpy2.notCalled).to.equal(true);
                expect(subscriberSpy3.notCalled).to.equal(true);
            });

            it('should not execute subscribers for other topics', () => {
                const message : IMessage<MockContent> = messageFactory(topic1);

                messageQueue.publish(message);

                expect(subscriberSpy3.notCalled).to.equal(true);
            });

            it('should execute subscribers for given topic', () => {
                const message : IMessage<MockContent> = messageFactory(topic1);

                messageQueue.publish(message);

                expect(subscriberSpy1.calledOnce).to.equal(true);
                expect(subscriberSpy2.calledOnce).to.equal(true);
            });

            it('should execute subscribers for given topic with message as argument', () => {
                const message : IMessage<MockContent> = messageFactory(topic1);

                messageQueue.publish(message);

                expect(subscriberSpy1.calledWithExactly(message)).to.equal(true);
                expect(subscriberSpy2.calledWithExactly(message)).to.equal(true);
            });

        });

        describe('setTrace method', () => {
            let consoleLogSpy : SinonSpy;
            let consoleGroupSpy : SinonSpy;
            let consoleGroupCollapsedSpy : SinonSpy;
            let consoleGroupEndSpy : SinonSpy;
            let consoleWarnSpy : SinonSpy;

            const oldConsoleLog            = console.log;
            const oldConsoleGroup          = console.group;
            const oldConsoleGroupCollapsed = console.groupCollapsed;
            const oldConsoleGroupEnd       = console.groupEnd;
            const oldConsoleWarn           = console.warn;

            before(() => {
                console.log            = function () {};
                console.group          = function () {};
                console.groupCollapsed = function () {};
                console.groupEnd       = function () {};
                console.warn           = function () {};
            });

            after(() => {
                console.log            = oldConsoleLog;
                console.group          = oldConsoleGroup;
                console.groupCollapsed = oldConsoleGroupCollapsed;
                console.groupEnd       = oldConsoleGroupEnd;
                console.warn           = oldConsoleWarn;
            });

            beforeEach(() => {
                const subscriber = new MockSubscriber(topic1);

                consoleLogSpy            = spy(console, 'log');
                consoleGroupSpy          = spy(console, 'group');
                consoleGroupCollapsedSpy = spy(console, 'groupCollapsed');
                consoleGroupEndSpy       = spy(console, 'groupEnd');
                consoleWarnSpy           = spy(console, 'warn');

                messageQueue = factory()();

                messageQueue.subscribe(subscriber);
            });

            afterEach(() => {
                consoleLogSpy.restore();
                consoleGroupSpy.restore();
                consoleGroupCollapsedSpy.restore();
                consoleGroupEndSpy.restore();
                consoleWarnSpy.restore();
            });

            it('should return itself', () => {
                expect(messageQueue.setTrace(true)).to.equal(messageQueue);
            });

            it('should not log by default', () => {
                messageQueue.publish(messageFactory(topic1));

                expect(consoleLogSpy.notCalled).to.equal(true);
                expect(consoleGroupSpy.notCalled).to.equal(true);
                expect(consoleGroupCollapsedSpy.notCalled).to.equal(true);
                expect(consoleGroupEndSpy.notCalled).to.equal(true);
                expect(consoleWarnSpy.notCalled).to.equal(true);
            });

            it('should not log if trace is setted to false', () => {
                messageQueue.publish(messageFactory(topic1));

                expect(consoleLogSpy.notCalled).to.equal(true);
                expect(consoleGroupSpy.notCalled).to.equal(true);
                expect(consoleGroupCollapsedSpy.notCalled).to.equal(true);
                expect(consoleGroupEndSpy.notCalled).to.equal(true);
                expect(consoleWarnSpy.notCalled).to.equal(true);
            });

            it('should log if trace is setted to true', () => {
                messageQueue.setTrace(true);

                messageQueue.publish(messageFactory(topic1));

                expect(consoleLogSpy.called).to.equal(true);
                expect(consoleGroupSpy.called).to.equal(true);
                expect(consoleGroupCollapsedSpy.called).to.equal(true);
                expect(consoleGroupEndSpy.called).to.equal(true);
            });

        });

    });

    describe('API', () => {

        it('should be present in API', () => {
            expect(API).to.not.be.undefined;
        });

        it('should equal to internal class', () => {
            expect(API).to.equal(MessageQueue);
        });

    });

});