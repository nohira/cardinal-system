import { IContent } from './IContent';
import { IMessage } from './IMessage';
import { ISubscriber } from './ISubscriber';

export interface IMessageQueue {
    subscribe<T extends IContent>(subscriber : ISubscriber<T>) : IMessageQueue;
    publish<T extends IContent>(message : IMessage<T>) : IMessageQueue;
}

export default IMessageQueue;