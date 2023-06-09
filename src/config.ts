import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv'
import { ConnectionOptions } from './types/hermes.types';

dotenv.config()

export const ApplicationConfig: ConnectionOptions = {
    host: process.env.HOST as string,
    port: Number(process.env.PORT),
    hermesKey: process.env.HERMES_KEY as string,
    hermesToken: process.env.HERMES_TOKEN as string
};

export const validateKey = (key: string, encryptedData: any) => {
    const split = encryptedData.split(':');
    if (split.length < 2) return '';

    const reb64 = CryptoJS.enc.Hex.parse(split[1]);
    const bytes = reb64.toString(CryptoJS.enc.Base64);
    
    const hash = CryptoJS.AES.decrypt(bytes, key, {
        iv: split[0],
        mode: CryptoJS.mode.CTR
    });
    const val = hash.toString(CryptoJS.enc.Utf8);
    const data = val.split('_');
    if(data[1] !== key) {
      return false;
    }
    return true;
}