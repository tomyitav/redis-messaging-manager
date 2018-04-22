import * as Redis from 'ioredis'
import { Observable } from 'rxjs/Observable'
import * as Promise from 'bluebird'

export class PubsubManager {
  private options: Redis.RedisOptions
  private redisClient: Redis.Redis
  private topicMaps: Map<string, Observable<any>>
  private serverEventsToObservables: Map<ServerEvent, Observable<any>>

  constructor(options?: Redis.RedisOptions) {
    this.options = Object.assign({}, this.getDefaultOptions(), options)
    this.redisClient = new Redis(this.options)
    this.topicMaps = new Map()
    this.serverEventsToObservables = new Map()
  }

  public publish(topic: string, message: string): Promise<number> {
    return this.redisClient.publish(topic, message)
  }

  public publishBulk(topic: string, messagesBulk: Array<string>): Promise<any> {
    if (messagesBulk && messagesBulk.length > 0) {
      let publishPipe = this.redisClient.pipeline()
      for (let message of messagesBulk) {
        publishPipe = publishPipe.publish(topic, message)
      }
      return publishPipe.exec()
    } else {
      return Promise.resolve()
    }
  }

  public consume(topic: string): Observable<any> {
    return this.topicMaps.has(topic)
      ? this.topicMaps.get(topic)
      : this.createNewTopicObservable(topic)
  }

  public getServerEventStream(eventName: ServerEvent): Observable<any> {
    return this.serverEventsToObservables.has(eventName)
      ? this.serverEventsToObservables.get(eventName)
      : this.createNewEventObservable(eventName)
  }

  public unsubscribe(topic: string) {
    this.redisClient.unsubscribe(topic)
    this.topicMaps.delete(topic)
  }

  private createNewTopicObservable(topic: string) {
    let shouldAddToSubscribedTopics: boolean = true
    let newObservable = Observable.create(observer => {
      this.redisClient.subscribe(topic, (err, numberOfChannels) => {
        if (err) {
          console.log('Got error- ', err)
          shouldAddToSubscribedTopics = false
          observer.error(err)
        } else {
          console.log(
            'connected to new channels, number is- ',
            numberOfChannels
          )
        }
      })
      this.redisClient.on('message', (channel, message) => {
        if (channel === topic) {
          observer.next(message)
        }
      })
    })
    if (shouldAddToSubscribedTopics) {
      this.topicMaps.set(topic, newObservable)
    }
    return newObservable
  }

  private createNewEventObservable(event: ServerEvent): Observable<any> {
    let eventObservable = Observable.create(observer => {
      this.redisClient.on(event, () => {
        observer.next()
      })
    })
    this.serverEventsToObservables.set(event, eventObservable)
    return eventObservable
  }

  private getDefaultOptions(): Redis.RedisOptions {
    return {
      host: 'localhost',
      port: 6379,
      retryStrategy: times => {
        let delay = Math.min(100 + times * 2, 2000)
        return delay
      },
      reconnectOnError: () => true
    }
  }
}

export type ServerEvent =
  | 'connect'
  | 'ready'
  | 'error'
  | 'close'
  | 'reconnecting'
  | 'end'
