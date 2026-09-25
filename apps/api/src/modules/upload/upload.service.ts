import { Injectable, BadRequestException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  private uploadsDir = path.join(process.cwd(), "uploads");

  constructor() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadImage(base64Data: string, folder: string = "general"): Promise<string> {
    if (!base64Data) throw new BadRequestException("No image data");
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) throw new BadRequestException("Invalid image format");
    const ext = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    if (buffer.length > 10 * 1024 * 1024) throw new BadRequestException("Image too large (max 10MB)");
    const fileName = Date.now() + "-" + Math.random().toString(36).substring(2) + "." + ext;
    const dir = path.join(this.uploadsDir, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, buffer);
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
    const filePath = path.join(process.cwd(), url.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}