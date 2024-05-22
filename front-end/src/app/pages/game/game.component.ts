import { Component, OnInit } from '@angular/core';
import { CardContentComponent } from '../../components/card-content/card-content.component';
import { CardIntroGameComponent } from '../../components/games/card-intro-game/card-intro-game.component';
import { GameService } from '../../services/games/game.service';
import { UserInfoService } from '../../services/user-info/user-info.service';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { ICategoryGame, IRootBoardGame } from '../../stores/game/game.reducer';
import { zip } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CardContentComponent, CardIntroGameComponent, CategoriesComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private userInfoService: UserInfoService,
    private router: Router
  ) {}

  category: ICategoryGame[] = [];
  board: IRootBoardGame[] = [];
  gameHistory: any[] = [];

  multiCateId: number[] = [];
  idsCate!: string;
  ngOnInit(): void {
    const token = this.userInfoService.getToken();
    if (token) {
      zip(
        this.gameService.fetchGameCateToStrore(token),
        this.gameService.fetchGameBoard(token, this.idsCate),
        this.gameService.fetchGameHistory(token)
      ).subscribe(([category, board, gameHistory]) => {
        if (category) {
          this.category = category;
        }
        if (board) {
          this.board = board;
        }
        if(gameHistory) {
          this.gameHistory = gameHistory;
        }
      });
    }
  }

  isChooseCate(id: number) {
    return this.multiCateId.includes(id);
  }

  getBoardByCate(id: number) {
    const token = this.userInfoService.getToken();
    // if (this.multiCateId.includes(id)) {
    //   const indexForDelete = this.multiCateId.findIndex((item) => item == id);
    //   this.multiCateId.splice(indexForDelete, 1);
    // } else {
    //   this.multiCateId.push(id);
    // }

    this.multiCateId = [id];

    this.reFetch();
  }

  getBoardByAll() {
    this.multiCateId = [];
    this.reFetch();
  }

  reFetch() {
    const token = this.userInfoService.getToken();
    if(token) {
      const cateIds =  this.multiCateId.join(',');
      this.gameService.fetchGameBoard(token, cateIds).subscribe(board => {
        if (board) {
          this.board = board;
        }else{
          this.board = [];
        }

        this.gameService.fetchGameHistory(token).subscribe();
      });
    }
  }

  goToPlay(param: number) {
    this.router.navigate([`game/play/${param}`]);
  }
}
