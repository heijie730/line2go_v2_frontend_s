import { timer, Observable, Subscription } from 'rxjs';
import { filter, concatMap, delayWhen } from 'rxjs/operators';

export class PollingUtil {
  private subscription: Subscription | null = null;
  private lastIntervalData: any;

  poll(
    task: () => Observable<any>,
    initialDelay: number,
    maxDelay: number,
    delayFactor: number,
    isHidden: () => boolean
  ): void {
    let delay = initialDelay;

    const source$ = timer(0, delay).pipe(
      filter(() => !isHidden()), // skip polling when the app is hidden
      concatMap(val => task().pipe(
        delayWhen((data) => {
          let hasDataChanged = JSON.stringify(this.lastIntervalData) !== JSON.stringify(data);
          if (!hasDataChanged) {
            delay = Math.min(delay * delayFactor, maxDelay); // increase delay if the data has not changed
          } else {
            delay = initialDelay; // reset delay if the data has changed
          }
          this.lastIntervalData = data;
          console.log(`Next poll in ${delay}ms`); // print the time till the next poll
          return timer(delay);
        })
      ))
    );

    this.subscription = source$.subscribe();
  }

  stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
