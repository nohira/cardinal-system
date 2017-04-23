import { expect } from 'chai';
import { Message as API } from '../../../lib';
import { IMessage } from '../../../src/interface/IMessage';
import { IPublisher } from '../../../src/interface/IPublisher';
import { Message } from '../../../src/message/Message';
import { Topic } from '../../../src/type/Topic';
import { MockContent } from '../mock/MockContent';
import { MockPublisher } from '../mock/MockPublisher';

describe('Message test suite', () => {

    const factory               = (publisher : IPublisher<MockContent>, topic : Topic, content? : MockContent) => () => new Message(publisher, topic, content);
    const publisher             = new MockPublisher<MockContent>();
    const topic : Topic         = 'namespace/topic';
    const content : MockContent = {
        attribute : 'value',
    };

    describe('Instantiation', () => {

        it('should instantiate without error (2 parameters)', () => {
            expect(factory(publisher, topic)).to.not.throw();
        });

        it('should instantiate without error (3 parameters)', () => {
            expect(factory(publisher, topic, content)).to.not.throw();
        });

    });

    describe('Runtime', () => {

        let message : IMessage<MockContent>;

        describe('Initialization with 2 parameters', () => {

            beforeEach(() => {
                message = factory(publisher, topic)();
            });

            it('should initialize publisher property', () => {
                expect(message.publisher).to.equal(publisher);
            });

            it('should initialize topic property', () => {
                expect(message.topic).to.equal(topic);
            });

            it('should initialize content property to undefined', () => {
                expect(message.content).be.undefined;
            });

        });

        describe('Initialization with 3 parameters', () => {

            beforeEach(() => {
                message = factory(publisher, topic, content)();
            });

            it('should initialize publisher property', () => {
                expect(message.publisher).to.equal(publisher);
            });

            it('should initialize topic property', () => {
                expect(message.topic).to.equal(topic);
            });

            it('should initialize content property', () => {
                expect(message.content).to.equal(content);
            });

        });

    });

    describe('API', () => {

        it('should be present in API', () => {
            expect(API).to.not.be.undefined;
        });

        it('should equal to internal class', () => {
            expect(API).to.equal(Message);
        });

    });

});