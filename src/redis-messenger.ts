import * as Redis from 'ioredis'
import { Observable } from 'rxjs/Observable'

export class PubsubManager {
  private options: Redis.RedisOptions
  private redisClient: Redis.Redis
  private topicMaps: Map<string, Observable<any>>

  constructor(host?: string, port?: number, options?: Redis.RedisOptions) {
    this.options = Object.assign(
      {},
      this.getDefaultOptions(host, port),
      options
    )
    this.redisClient = new Redis(this.options)
    this.topicMaps = new Map()
  }

  public publish(topic: string, message: string) {
    return this.redisClient.publish(topic, message)
  }

  public consume(topic: string): Observable<any> {
    return this.topicMaps.has(topic)
      ? this.topicMaps.get(topic)
      : this.createNewTopicObservable(topic)
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
          console.log('connected to new ', numberOfChannels)
        }
      })
      this.redisClient.on('message', (channel, message) => {
        if (channel === topic) {
          console.log('got new message- ', message)
          observer.next(message)
        }
      })
    })
    if (shouldAddToSubscribedTopics) {
      this.topicMaps.set(topic, newObservable)
    }
    return newObservable
  }

  private getDefaultOptions(host?: string, port?: number): Redis.RedisOptions {
    return {
      host: host || 'localhost',
      port: port || 6379,
      retryStrategy: times => {
        let delay = Math.min(100 + times * 2, 2000)
        return delay
      },
      reconnectOnError: () => true
    }
  }
}
