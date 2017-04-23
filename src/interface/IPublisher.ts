import { IContent } from './IContent';

export interface IPublisher<T extends IContent> {
    execute(content? : T) : void;
}