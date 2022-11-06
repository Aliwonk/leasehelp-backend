import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs/promises';

@Injectable()
export class FilesService {
  // constructor() {}
  async checkFile(files: Array<Express.Multer.File>) {
    const fileBuffer = await fs.readFile(files[0].path);
    const data = await pdfParse(fileBuffer, { version: 'v2.0.550' });
    return JSON.stringify(data.text);
  }
}
