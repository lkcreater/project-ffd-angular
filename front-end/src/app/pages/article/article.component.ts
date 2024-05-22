import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { VideoComponent } from '../../components/videos/video/video.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { ICategoryGame } from '../../stores/game/game.reducer';

const mockCategory: ICategoryGame[] = [
  {
    gmCateId: 1,
    gmCateTitle: 'ออม',
    active: true,
    createdBy: 'admin',
    createdDatetime: 'admin',
    gmCateImage: null,
    gmCateOption: null,
    gmCateSlug: null,
    order: 1,
    updatedBy: 'admin',
    updatedDatetime: 'admin',
    gmCateDetail: null
  },
  {
    gmCateId: 2,
    gmCateTitle: 'หนี้สิน',
    active: true,
    createdBy: 'admin',
    createdDatetime: 'admin',
    gmCateImage: null,
    gmCateOption: null,
    gmCateSlug: null,
    order: 1,
    updatedBy: 'admin',
    updatedDatetime: 'admin',
    gmCateDetail: null
  },
  {
    gmCateId: 3,
    gmCateTitle: 'ลงทุน',
    active: true,
    createdBy: 'admin',
    createdDatetime: 'admin',
    gmCateImage: null,
    gmCateOption: null,
    gmCateSlug: null,
    order: 1,
    updatedBy: 'admin',
    updatedDatetime: 'admin',
    gmCateDetail: null
  }
];

const mockContents = [
  {
    gmCateId: 1,
    title: 'จัดสรรเงินออมยังไง ให้ตอบโจทย์ทุกเป้าหมาย',
    link: 'https://www.youtube.com/embed/59t2RincSuE'
  },
  {
    gmCateId: 2,
    title: 'หนี้แก้ได้ ถ้าวางแผนการเงินให้ถูกวิธี โดย "โค้ชหนุ่ม จักรพงษ์"',
    link: 'https://www.youtube.com/embed/wTu3_jEtZFs'
  },
  {
    gmCateId: 3,
    title: 'มือใหม่อยากลงทุน ควรเริ่มต้นอย่างไร?',
    link: 'https://www.youtube.com/embed/j5EZLmZ82LM'
  }
]

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CardContentComponent, VideoComponent, CategoriesComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  @ViewChildren('articleVideo') articleVideo!: ElementRef[];

  constructor(private userInfoService: UserInfoService) {}

  category: ICategoryGame[] = mockCategory;
  contents: any[] = mockContents;
  multiCateId: number[] = [];
  idsCate!: string;

  getBoardByCate(id: number) {
    // const token = this.userInfoService.getToken();
    // if (this.multiCateId.includes(id)) {
    //   const indexForDelete = this.multiCateId.findIndex((item) => item == id);
    //   this.multiCateId.splice(indexForDelete, 1);
    // } else {
    //   this.multiCateId.push(id);
    // }

    this.multiCateId = [id];

    this.contents = mockContents.filter((item) => item.gmCateId == id);

    // this.reFetch();
  }
  getBoardByAll() {
    this.multiCateId = [];
    this.contents = mockContents;
  }

  isChooseCate(id: number) {
    return this.multiCateId.includes(id);
  }

  getNameCategory(id: number) {
    return mockCategory.find(c => c.gmCateId == id)?.gmCateTitle ?? '';
  }
  
  reFetch() {
    const token = this.userInfoService.getToken();
    if (token) {
      const cateIds = this.multiCateId.join(',');
      // this.gameService.fetchGameBoard(token, cateIds).subscribe(board => {
      //   if (board) {
      //     this.board = board;
      //   }else{
      //     this.board = [];
      //   }

      //   this.gameService.fetchGameHistory(token).subscribe();
      // });
    }
  }
}
