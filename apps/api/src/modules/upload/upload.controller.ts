import { Controller, Post, Body, Delete, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UploadService } from "./upload.service";

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  constructor(private svc: UploadService) {}

  @Post("image")
  @ApiOperation({ summary: "Upload single image as base64" })
  async uploadImage(@Body() body: any) {
    const image = body.image || body.base64 || body.file;
    const folder = body.folder || "general";
    if (!image) throw new BadRequestException("No image data. Send 'image' field with base64 data.");
    const url = await this.svc.uploadImage(image, folder);
    return { success: true, url };
  }

  @Post("images")
  @ApiOperation({ summary: "Upload multiple images" })
  async uploadMultiple(@Body() body: any) {
    const images = body.images;
    if (!images || !Array.isArray(images)) throw new BadRequestException("Send 'images' array of base64 data.");
    const folder = body.folder || "products";
    const urls = await this.svc.uploadMultiple(images, folder);
    return { success: true, urls };
  }

  @Delete("image")
  @ApiOperation({ summary: "Delete image by URL" })
  async deleteImage(@Body() body: any) {
    if (!body.url) throw new BadRequestException("Send 'url' field.");
    await this.svc.deleteImage(body.url);
    return { success: true, message: "Image deleted" };
  }
}