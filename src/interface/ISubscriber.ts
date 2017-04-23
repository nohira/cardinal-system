import { Topic } from '../type/Topic';
import { IContent } from './IContent';
import { IMessage } from './IMessage';

export interface ISubscriber<T extends IContent> {
    readonly topic : Topic;
    execute(message : IMessage<T>) : void;
}

export default ISubscriber;