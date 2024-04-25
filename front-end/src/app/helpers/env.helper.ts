import { environment } from '../../environments/environment';

export class EnvHelper {
    private _environment: unknown = environment;

    public getKeyAll() {
        return this._environment;
    }

    public getKey<T = unknown>(keyName: string, defualtValue: T | null = null) {
        const env = this._environment as any;
        return env[keyName] ?? defualtValue
    }

    public getMode() {
        return this.getKey('name');
    }

    public static mode() {
        return new EnvHelper().getMode();
    }

    public static key<T = unknown>(keyName: string, defualtValue: T | null = null) {
        return new EnvHelper().getKey(keyName, defualtValue);
    }
}
