export class TextHelper {
  public static maskInput(type: 'EMAIL' | 'PHONE', value: string) {
    let txt = '';
    if (type == 'EMAIL') {
      const email = value.split('@');
      txt = `${email[0]?.slice(0, 3) ?? ''}xxx@${email[1] ?? ''}`;
    }

    if (type == 'PHONE') {
      txt = `xxx-xxx-${value?.slice(6, 10) ?? ''}`;
    }
    return txt;
  }
}
