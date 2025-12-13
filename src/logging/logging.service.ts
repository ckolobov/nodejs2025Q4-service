import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  private formatMessage(level: string, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] [${level}]${contextStr} ${message}`;
  }

  log(message: any, context?: string) {
    console.log(this.formatMessage('LOG', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage('ERROR', message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  debug(message: any, context?: string) {
    console.debug(this.formatMessage('DEBUG', message, context));
  }

  verbose(message: any, context?: string) {
    console.log(this.formatMessage('VERBOSE', message, context));
  }

  logRequest(method: string, url: string, query: any, body: any) {
    const logData = {
      method,
      url,
      query: Object.keys(query).length > 0 ? query : undefined,
      body: body && Object.keys(body).length > 0 ? body : undefined,
    };
    this.log(`Incoming Request: ${JSON.stringify(logData)}`, 'HTTP');
  }

  logResponse(method: string, url: string, statusCode: number, responseTime: number) {
    const logData = {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
    };
    this.log(`Response: ${JSON.stringify(logData)}`, 'HTTP');
  }
}
