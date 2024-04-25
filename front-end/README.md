# TiscoApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Add LINE chanel

เพิ่ม LINE Provider เข้าไปที่ directory env ของ Angular `./environments` เลือกตั้งค่าตาม ENV ที่ต้องการ Deploy

    .
    ├── ...
    ├── environments                  
    │   ├── environment.development.ts    
    │   ├── environment.sit.ts   
    │   ├── environment.uat.ts   
    │   └── environment.ts
    └── ...

ตัวอย่างไฟล์ `./environments/environment.development.ts`

```
export const environment = { 
    ...,
    lineLoginWeb: {
        '1010101022': {                         #LINE Channel ID
            liffId: '1010101022-xyz..',         #LINE LIFF ID
            icon: './assets/line/icon.jpg',     #Image icon แสดงหน้า ffd
            name: 'เข้าสู่ระบบด้วย Line PVD',       #Label แสดงหน้า ffd
            clientId: '1010101022',             #LINE Channel ID
            client_secret: 'abc12345abc',       #LINE Channel secret
        },
        ... #more
    }
}
```

การตั้งค่า link callback ของ LINE

> [!NOTE]
> LINE Login ตั้งค่า Callback URL -> https://{{HOST}}/auth/callback

> [!NOTE]
> LINE LIFF Login ตั้งค่า Endpoint URL -> https://{{HOST}}/auth/liff-authen?liffClientId={{Channel ID}}
> `https://domain.abc/auth/liff-authen?liffClientId=1010101022`

> [!WARNING]
> ตั้งค่า Scopes ใน LINE Developer ให้เปิด `profile` และ `openid`
