/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config();

// CREATE ENV FILE
const contentFile = getFileContentWithModification('./src/environments/environment.exp.ts');
const envLocalFile = './src/environments/environment.ts';
if (!fs.existsSync(envLocalFile)) {
  writeFileUsingFS(envLocalFile, contentFile);
}
const envProdFile = './src/environments/environment.prod.ts';
writeFileUsingFS(envProdFile, contentFile);


// CREATE MESSAGING FILE
const contentMessagingFile = getFileContentWithModification('./src/firebase-messaging-sw.exp.js');
const messagingLocalFile = './src/firebase-messaging-sw.js';
writeFileUsingFS(messagingLocalFile, contentMessagingFile);


function writeFileUsingFS(targetPath: string, environmentFileContent: string) {
  fs.writeFile(targetPath, environmentFileContent, function (err: any) {
    if (err) {
      console.log(err);
    }
    if (environmentFileContent !== '') {
      console.log(colors.magenta(`${targetPath} file generated correctly`));
    }
  });
}


function getFileContentWithModification(modelo: string) {
  const regEx = /(\w+)\s?\:\s?(:\w+|'.*'),?/gm;
  const file = fs.readFileSync(modelo, 'utf8');

  const envConfigFile = file.replace(regEx, (_match: string, attr: string, vle: string) => {
    // TRANSFORM ATTR IN SNAKE CASE
    const envVar = attr
      .split(/(?=[A-Z])/)
      .join('_')
      .toUpperCase();

    // FORMAT VALUE
    let attrName = attr;

    var attrValue: string | undefined = '';
    if (attr === 'databaseURL') {
      attrValue = process.env.DATABASE_URL;
    } else {
      attrValue = process.env[envVar];
    }
    if (vle) {
      vle = `'${vle}'`;
    }

    return `${attrName}: '${attrValue}',`;
  });
  return envConfigFile;
}
