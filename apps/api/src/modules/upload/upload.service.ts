import { Injectable, BadRequestException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  private uploadsDir = path.join(process.cwd(), "uploads");

  constructor() {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      }
    } catch (e) {
      console.error("Could not create uploads dir:", e);
    }
  }

  async uploadImage(base64Data: string, folder: string = "general"): Promise<string> {
    if (!base64Data) {
      throw new BadRequestException("No image data provided");
    }

    // Handle data URI format
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new BadRequestException("Invalid image format. Must be base64 data URI.");
    }

    const ext = matches[1];
    const buffer = Buffer.from(matches[2], "base64");

    if (buffer.length === 0) {
      throw new BadRequestException("Empty image data");
    }

    if (buffer.length > 20 * 1024 * 1024) {
      throw new BadRequestException("Image too large (max 20MB)");
    }

    const fileName = Date.now() + "-" + Math.random().toString(36).substring(2, 10) + "." + ext;
    const dir = path.join(this.uploadsDir, folder);

    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      throw new BadRequestException("Could not create upload directory");
    }

    const filePath = path.join(dir, fileName);

    try {
      fs.writeFileSync(filePath, buffer);
    } catch (e) {
      throw new BadRequestException("Failed to save image");
    }

    return "/uploads/" + folder + "/" + fileName;
  }

  async uploadMultiple(images: string[], folder: string = "products"): Promise<string[]> {
    const urls: string[] = [];
    for (const img of images) {
      const url = await this.uploadImage(img, folder);
      urls.push(url);
    }
    return urls;
  }

  async deleteImage(url: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), url.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      // ignore
    }
  }
}