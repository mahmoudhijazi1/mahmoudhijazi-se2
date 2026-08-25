import { promises as fs } from 'fs';
import logger from '../logger';

export async function readJSONfile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent) as T;
        return data;
    } catch (error) {
        logger.error("Error in parsing JSON file", error);
        throw error;
    }
}