import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: LogLevel;
  private logFilePath: string;
  private maxFileSizeKb: number;

  constructor() {
    const envLogLevel = process.env.LOG_LEVEL?.toUpperCase() || 'LOG';
    this.logLevel =
      LogLevel[envLogLevel as keyof typeof LogLevel] ?? LogLevel.LOG;

    this.logFilePath = process.env.LOG_FILE_PATH || 'logs/app.log';
    this.maxFileSizeKb = parseInt(process.env.LOG_FILE_MAX_SIZE || '1024', 10);

    this.ensureLogDirectory();
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] [${level}]${contextStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private checkAndRotateLog(): void {
    if (!fs.existsSync(this.logFilePath)) {
      return;
    }

    const stats = fs.statSync(this.logFilePath);
    const fileSizeKb = stats.size / 1024;

    if (fileSizeKb >= this.maxFileSizeKb) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = path.extname(this.logFilePath);
      const basename = path.basename(this.logFilePath, ext);
      const dirname = path.dirname(this.logFilePath);
      const rotatedFileName = `${basename}-${timestamp}${ext}`;
      const rotatedFilePath = path.join(dirname, rotatedFileName);

      fs.renameSync(this.logFilePath, rotatedFilePath);
    }
  }

  private writeToFile(message: string): void {
    try {
      this.checkAndRotateLog();
      fs.appendFileSync(this.logFilePath, message + '\n', 'utf8');
    } catch (error) {
      // Fallback to console only if file write fails
      console.error('Failed to write to log file:', error);
    }
  }

  log(message: any, context?: string) {
    if (this.shouldLog(LogLevel.LOG)) {
      const formattedMessage = this.formatMessage('LOG', message, context);
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMessage = this.formatMessage('ERROR', message, context);
      console.error(formattedMessage);
      this.writeToFile(formattedMessage);
      if (trace) {
        console.error(trace);
        this.writeToFile(trace);
      }
    }
  }

  warn(message: any, context?: string) {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMessage = this.formatMessage('WARN', message, context);
      console.warn(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  debug(message: any, context?: string) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage('DEBUG', message, context);
      console.debug(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }

  verbose(message: any, context?: string) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      const formattedMessage = this.formatMessage('VERBOSE', message, context);
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
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

  logResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
  ) {
    const logData = {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
    };
    this.log(`Response: ${JSON.stringify(logData)}`, 'HTTP');
  }
}
