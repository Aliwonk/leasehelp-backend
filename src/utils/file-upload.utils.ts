import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const filesFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|pdf)$/)) {
    return callback(
      new HttpException(
        'Invalid file type. Allowed: jpg, pdf',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  callback(null, true);
};

export const editFileName = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: string) => void,
) => {
  let randomName;
  if (req.params.id) {
    randomName = req.params.id;
  } else {
    randomName = Array(6)
      .fill(null)
      .map(() => Math.round(Math.random() * 10).toString(10))
      .join('');
  }
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `${name}_${randomName}${fileExtName}`);
};
