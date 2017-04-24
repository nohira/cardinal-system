import { IContent } from '../interface/IContent';
import { IMessage } from '../interface/IMessage';
import { IMessageQueue } from '../interface/IMessageQueue';
import { ISubscriber } from '../interface/ISubscriber';
import { Topic } from '../type/Topic';

export class MessageQueue implements IMessageQueue {
    public constructor(name : string = 'Topic') {
        this.name        = name;
        this.subscribers = new Map<Topic, Set<ISubscriber<any>>>();
    }

    public subscribe<T extends IContent>(subscriber : ISubscriber<T>) : IMessageQueue {
        const topic = subscriber.topic;

        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, new Set<ISubscriber<any>>());
        }

        this.subscribers.get(topic).add(subscriber);

        return this;
    }

    public publish<T extends IContent>(message : IMessage<T>) : IMessageQueue {
        const topic = message.topic;

        if (!this.subscribers.has(topic)) {
            console.warn(`${topic} has no subscriber, message dropped`);
            return this;
        }

        try {
            if (this._trace) {
                console.groupCollapsed(`${this.name} ${topic} sent`);
                console.group('publisher');
                console.log(message.publisher);
                console.log(message);
                console.groupEnd();
                console.group('subscribers');
            }

            this.subscribers.get(topic).forEach((subscriber) => {
                subscriber.execute(message);
                if (this._trace) {
                    console.log(subscriber);
                }
            });
        } finally {
            if (this._trace) {
                console.groupEnd();
                console.groupEnd();
            }
        }

        return this;
    }

    public setTrace(trace : boolean) : MessageQueue {
        this._trace = trace;

        return this;
    }

    public readonly name : string;
    public readonly subscribers : Map<Topic, Set<ISubscriber<any>>>;
    protected _trace : boolean = false;
}

export default MessageQueue;