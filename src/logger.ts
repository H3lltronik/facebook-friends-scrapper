const winston = require("winston");
const fs = require("fs");
const date = new Date();
const folderName = `results/execution-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getMinutes()}`;
const fileName = `results.json`;

const createFolderRecursive = (path: string) => {
  const folders = path.split("/");
  let currentPath = "";
  for (const folder of folders) {
    currentPath += folder + "/";
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
};

createFolderRecursive(folderName);

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: `${folderName}/error.log`,
      level: "error",
    }),
    new winston.transports.File({ filename: `${folderName}/info.log` }),
  ],
});

export const saveToFile = (data: any, prettyPrint: boolean = false) => {
  return new Promise((resolve, reject) => {
    let jsonData;
    if (prettyPrint) {
      jsonData = JSON.stringify(data, null, 2);
    } else {
      jsonData = JSON.stringify(data);
    }
    fs.appendFile(`${folderName}/${fileName}`, jsonData, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

export const LOG_TYPES = Object.freeze({
    INFO: Symbol(),
    ERROR: Symbol(),
  });
  
  type LogType = typeof LOG_TYPES[keyof typeof LOG_TYPES];
  
  interface LogParams {
    prettyPrint?: boolean;
    type?: LogType;
  }
  
  export const log = async (message: string, params: LogParams = {}) => {
    const { prettyPrint, type } = params;
    console.log(message);
  
    if (type === LOG_TYPES.ERROR) {
      await logger.error(message);
      return;
    }
  
    await logger.info(message);
  };
  
