import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IUserInfoData } from '../../stores/user-info/user-info.reducer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UserInfoService } from '../../services/user-info/user-info.service';

export interface INavigationMenuBar {
  id: string;
  label: string;
  link: any[];
  icon: string;
  active: boolean;
}

export const initailMenuBar: INavigationMenuBar[] = [
  {
    id: 'menu-page-home',
    label: 'หน้าหลัก',
    link: [''],
    icon: './assets/menubar/icon-home.svg',
    active: true,
  },
  {
    id: 'menu-page-profile',
    label: 'จัดการบัญชีผู้ใช้งาน',
    link: ['profile'],
    icon: './assets/menubar/icon-user.svg',
    active: false,
  },
  {
    id: 'menu-page-game',
    label: 'เกมส์',
    link: ['game'],
    icon: './assets/menubar/icon-game.svg',
    active: false,
  },
  {
    id: 'menu-page-reward',
    label: 'รางวัล',
    link: ['reward'],
    icon: './assets/menubar/icon-reward.svg',
    active: false,
  },
  {
    id: 'menu-page-ranking',
    label: 'ตารางคะแนน',
    link: ['ranking'],
    icon: './assets/menubar/icon-ranking.svg',
    active: false,
  },
  {
    id: 'menu-page-course',
    label: 'เรียนรู้',
    link: ['course'],
    icon: './assets/menubar/icon-course.svg',
    active: false,
  },
  {
    id: 'menu-page-product',
    label: 'ผลิตภัณฑ์',
    link: ['product'],
    icon: './assets/menubar/icon-product.svg',
    active: false,
  },
  {
    id: 'menu-page-question',
    label: 'คำถามที่พบบ่อย',
    link: ['question'],
    icon: './assets/menubar/icon-question.svg',
    active: false,
  }
];

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, NzModalModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {  
  constructor(
    private userInfoService: UserInfoService,
    private router: Router,
    private modal: NzModalService
  ) {}

  //-- public state 
  itemsMenuList: INavigationMenuBar[] = initailMenuBar;
  openToggle: boolean = false;
  userInfo!: IUserInfoData;
  btnLogout: boolean = false;

  ngOnInit(): void {
    const currentMenu = this.itemsMenuList.find(item => item.link[0] == this.router.url.replace('/', ''));
    if(currentMenu) {
      this.renderActiveMenu(currentMenu);
    }

    this.userInfoService.getUserInfo().subscribe((result) => {
      if (result?.isAuthenticated == true) {
        this.btnLogout = true;
      }
    });
  }

  btnHamberger() {
    this.openToggle = !this.openToggle;
  }

  actionMenuNavigate(menu: INavigationMenuBar) {
    this.btnHamberger();
    this.router.navigate(menu.link);
  }

  renderActiveMenu(menu: INavigationMenuBar) {
    for (let item of this.itemsMenuList) {
      if(item.id == menu.id) {
        Object.assign(item, {
          active: true,
        });
      }else {
        Object.assign(item, {
          active: false,
        });
      }
    }
  }

  logout() {
    this.modal.confirm({
      nzTitle: 'คุณต้องการออกจากระบบใช่หรือไม่',
      nzOnOk: () => this.router.navigate(['/auth/log-out']),
    });
  }
}
