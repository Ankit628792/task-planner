import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { map, tap } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    private readonly logger = new Logger(ResponseInterceptor.name)

    intercept(context: ExecutionContext, next: CallHandler<T>) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'] || 'Unknown';
        const startTime = Date.now();

        this.logger.debug(`Incoming request: ${method} ${url} | IP: ${ip} | User-Agent: ${userAgent}`);

        return next.handle()
            .pipe(
                map((data: any) => {
                    let message = '';
                    if (data?.message) {
                        message = data.message;
                        delete data.message;
                    }
                    return {
                        success: response.statusCode < 400,
                        statusCode: response.statusCode,
                        message,
                        data: Object.keys(data).length ? data : null
                    }
                }),
                tap(({ statusCode, data }) => {
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    this.logger.log(
                        `Response sent: ${method} ${url} | Status: ${statusCode} | Duration: ${duration}ms | IP: ${ip} | User-Agent: ${userAgent}`
                    );

                    if (statusCode >= 400) {
                        this.logger.error(`Error response: ${JSON.stringify(data)}`);
                    }
                })
            );
    }
}