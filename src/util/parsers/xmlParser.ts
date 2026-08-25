import { promises as fs } from 'fs';
import logger from '../logger';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export async function readXMLfile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = parser.parse(fileContent) as T;
        return data;
    } catch (error) {
        logger.error("Error in parsing XML file", error);
        throw error;
    }
}