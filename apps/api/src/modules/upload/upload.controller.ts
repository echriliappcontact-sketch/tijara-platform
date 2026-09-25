import { Controller, Post, Body, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UploadService } from "./upload.service";

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  constructor(private svc: UploadService) {}

  @Post("image") @ApiOperation({ summary: "Upload single image" })
  async uploadImage(@Body() body: { image: string; folder?: string }) {
    const url = await this.svc.uploadImage(body.image, body.folder || "general");
    return { url };
  }

  @Post("images") @ApiOperation({ summary: "Upload multiple images" })
  async uploadMultiple(@Body() body: { images: string[]; folder?: string }) {
    const urls = await this.svc.uploadMultiple(body.images, body.folder || "products");
    return { urls };
  }

  @Delete("image") @ApiOperation({ summary: "Delete image" })
  async deleteImage(@Body() body: { url: string }) {
    await this.svc.deleteImage(body.url);
    return { message: "Image deleted" };
  }
}