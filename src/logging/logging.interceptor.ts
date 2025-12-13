import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, query, body } = request;
    const startTime = Date.now();

    // Log the incoming request
    this.loggingService.logRequest(method, url, query, body);

    return next.handle().pipe(
      finalize(() => {
        const responseTime = Date.now() - startTime;
        const { statusCode } = response;

        // Log the response
        this.loggingService.logResponse(method, url, statusCode, responseTime);
      }),
    );
  }
}
