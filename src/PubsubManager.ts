import * as Redis from 'ioredis';
import { Observable } from 'rxjs/Observable';

export class PubsubManager {

    private options: Redis.RedisOptions;
    private redisClient: Redis.Redis;
    constructor(host?: string, port?: number, options?: Redis.RedisOptions) {
        this.options = Object.assign({}, this.getDefaultOptions(host, port), options);
        this.redisClient = new Redis(this.options);
    }

    public publish(topic: string, message: string) {
        return this.redisClient.publish(topic, message);
    }

    public consume(topic: string): Observable<any> {
        return Observable.create(observer => {
            this.redisClient.subscribe(topic, (err, res) => {
                if(err) {
                    observer.error(err);
                }
                else {
                    observer.next(res);
                }
            })
        });
    }

    private getDefaultOptions(host?: string, port?: number): Redis.RedisOptions {
        return {
            host: host || 'localhost',
            port: port || 6379,
            retryStrategy: times => {
                let delay = Math.min(100 + times * 2, 2000);
                return delay;
            },
            reconnectOnError: (err) => true,
        }
    }
}