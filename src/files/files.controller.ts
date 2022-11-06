import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Role } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { editFileName, filesFilter } from 'src/utils/file-upload.utils';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  // @Role('USER')
  // @UseGuards(RolesGuard)
  @Post('upload/:id')
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads/user/files'),
        filename: editFileName,
      }),
      fileFilter: filesFilter,
    }),
  )
  async uploadFiles(
    @Param('id') userId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.filesService.checkFile(files);
  }

  @Get('get/:id')
  async getFile(@Param('id') id: number) {
    return id;
  }

  @Role('ADMIN')
  @UseGuards(RolesGuard)
  @Get('get/all')
  async getAllFiles() {
    return 'all';
  }
}
