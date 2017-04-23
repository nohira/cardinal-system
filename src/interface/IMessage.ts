import { Topic } from '../type/Topic';
import { IPublisher } from './IPublisher';

export interface IMessage<T> {
    readonly publisher : IPublisher<T>;
    readonly topic : Topic;
    readonly content? : T;
}