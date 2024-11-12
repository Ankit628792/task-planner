import { ArgumentsHost, ExceptionFilter, Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name)
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const isHttpException = exception instanceof HttpException;

        const status = isHttpException
            ? (exception as HttpException).getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR

        const errorResponse = isHttpException
            ? (exception as HttpException).getResponse()
            : {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error'
            }

        const responsePayload = {
            success: false,
            statusCode: status,
            error: true,
            method: request.method,
            path: request.url,
            timestamp: new Date().toISOString(),
            message: typeof errorResponse === "object" ? (typeof errorResponse['message'] === "string" ? errorResponse['message'] : errorResponse['message'][0]) || errorResponse : errorResponse,
            stack: exception.stack
        }

        return response.status(status).json(responsePayload);
    }
}