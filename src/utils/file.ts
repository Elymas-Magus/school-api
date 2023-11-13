import * as fs from "fs";
import * as path from "path";

export class File {
  static create(originalname: string) {
    const filename = originalname.split(".")[0];
    const extension = File.extname(originalname);
    const basename = filename + extension;
    const path = File.applyUploadPath(basename);

    return { filename, extension, basename, path };
  }

  static extname(filename: string): string {
    return path.extname(filename);
  }

  static getUploadPath(): string {
    return path.join(__dirname, "../..", "/storage/uploads");
  }

  static applyUploadPath(filename: string): string {
    return path.join(__dirname, "../..", "/storage/uploads/", filename);
  }

  static async upload(path: string, buffer: any) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, buffer, (err: NodeJS.ErrnoException | null): void => {
        if (err) reject(err);
        resolve(path);
      });
    });
  }

  static async delete(path: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, function (err: any) {
        if (err) reject(err);
        resolve(path);
      });
    });
  }
}
