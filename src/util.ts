declare const java: any;

export class Utils {

  static File(name: string): java.io.FileInputStream {
    let clientFile = new java.io.File(name);
    return new java.io.FileInputStream(clientFile);
  }

  static isValidatePath(path: string): boolean {
    if (path === null || path.length === 0) return false;
    return true;
  }

  static isValidateMethod(method: string): boolean {
    return true;
  }
}