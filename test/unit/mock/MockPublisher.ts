import { IContent } from '../../../src/interface/IContent';
import { IPublisher } from '../../../src/interface/IPublisher';

export class MockPublisher<T extends IContent> implements IPublisher<T> {
    execute(content? : T) : void {
    }
}