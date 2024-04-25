import * as bcryptjs from 'bcryptjs';

export class BcryptHelper {
  public static hash(key: string) {
    return bcryptjs.hashSync(key, 10);
  }

  public static compareHash(key: string, hash: string) {
    return bcryptjs.compareSync(key, hash);
  }

  public static verifyHash(hash: string) {
    return BcryptHelper.hash(hash + '@true');
  }
}
