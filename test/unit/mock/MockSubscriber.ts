import { IContent } from '../../../src/interface/IContent';
import { IMessage } from '../../../src/interface/IMessage';
import { ISubscriber } from '../../../src/interface/ISubscriber';
import { Topic } from '../../../src/type/Topic';

export class MockSubscriber<T extends IContent> implements ISubscriber<T> {
    constructor(topic : Topic) {
        this.topic = topic;
    }

    execute(message : IMessage<T>) : void {}

    public readonly topic : Topic;
}

export default MockSubscriber;