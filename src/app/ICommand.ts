export interface ICommand<T> {
  command: string;
  payload?: T;
}
