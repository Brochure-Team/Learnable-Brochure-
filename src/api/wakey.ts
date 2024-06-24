import axios from 'axios';
import { logger } from './utils';
import { baseUrl, pingTime } from '../configs';

const ping = async () => {
    try{
        const { data } = await axios.get(`${baseUrl}/ping`);
        logger.info(`Server pinged successfully: ${data.message}! Status code is ${data.status} & Status text is ${data.statusText}`);
    } catch(e: any) {
        logger.info(`this the error message: ${e.message}`); 
    }
};

setInterval(ping, pingTime)