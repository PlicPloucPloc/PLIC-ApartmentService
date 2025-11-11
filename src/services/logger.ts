import winston, { Logger } from "winston";

const {combine, timestamp, json, label,printf } = winston.format;

export function getLogger(name: string) : Logger{

    const myFormat = winston.format.combine(
      winston.format.colorize({
          all:true
      }),
      winston.format.label({
          label:`[${name}]`
      }),
      winston.format.timestamp({
          format:"HH:mm:ss"
      }),
      printf(
          info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
      )
    );
    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: json(),
      defaultMeta: { service: name },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({ format: combine(
            label({ label: name }),
            timestamp(),
            myFormat
      )}),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
}

