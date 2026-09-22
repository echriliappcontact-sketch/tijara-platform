import { Controller, Post, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UploadsService } from "./uploads.service";
@ApiTags("Uploads") @Controller("uploads")
export class UploadsController {
  constructor(private svc: UploadsService) {}
  @Post() @ApiOperation({ summary: "Upload file" }) @UseInterceptors(FileInterceptor("file")) upload(@UploadedFile() file: any) { return this.svc.upload(file); }
}
