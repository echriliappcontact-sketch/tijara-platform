import { Injectable } from "@nestjs/common";
@Injectable()
export class UploadsService {
  async upload(file: any) { return { filename: file.filename, originalname: file.originalname, size: file.size, mimetype: file.mimetype }; }
}
