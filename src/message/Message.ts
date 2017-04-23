import { IContent } from '../interface/IContent';
import { IMessage } from '../interface/IMessage';
import { IPublisher } from '../interface/IPublisher';
import { Topic } from '../type/Topic';

export class Message<T extends IContent> implements IMessage<T> {

    public constructor(publisher : IPublisher<T>, topic : Topic, content? : T) {
        this.publisher = publisher;
        this.topic     = topic;
        this.content   = content;
    }

    readonly publisher : IPublisher<T>;
    readonly topic : Topic;
    readonly content : T;
}