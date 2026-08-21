export interface ISubscriber<T> {
  id: string;
  notify: (context: T) => void;
}

export interface IPublisher<T> {
  subscribe: (subscribe: ISubscriber<T>) => void;
  unsubscribe: (id: string) => void;
}
