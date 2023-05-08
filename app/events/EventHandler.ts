export abstract class EventHandler<T>  {
  abstract getEventName(): string
  abstract execute(data: T);

  public logEvent(data: any) {
    console.log('event: ', data)
  }
}