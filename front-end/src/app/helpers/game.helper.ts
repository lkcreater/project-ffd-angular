import { IFormatBoardGame } from '../stores/game/game.reducer';

export enum EFormatGameKey {
  GAME_TURE_FALSE = 'GAME_TURE_FALSE',
  GAME_MATCHING = 'GAME_MATCHING',
}

export const GameConfig = {
  timeQuestionStart: 1000,
} 

export type TAnimateCountFunction = (val: number) => void;

export class GameHelper {
  constructor(private game: IFormatBoardGame) {}

  isPlaying(): boolean {
    if (this.game?.gmRuleGame?.format) {
      return true;
    }
    return false;
  }

  getFormat() {
    return this.game?.gmRuleGame?.format ?? null;
  }

  isFormat(format: EFormatGameKey) {
    return this.getFormat() && this.getFormat() == format;
  }

  getRules() {
    return this.game?.gmRuleGame
  }

  //-- คะแนนเต็ม ในแต่ล่ะข้อ
  getScorePerQuestion() {
    return this.game?.gmRuleGame?.score ?? 100;
  }

  //-- ช่วงเวลาที่ไม่เอาคะแนนไปคำนวณ (วินาที)
  getTimeScope() {
    return this.game?.gmRuleGame?.timeScope ?? 10;
  }

  //-- เวลาเต็มต่อข้อ (วินาที)
  getTimeMax() {
    return this.game?.gmRuleGame?.timeMax ?? 60;
  }

  getScore(time: number) {
    if(this.getFormat() == EFormatGameKey.GAME_TURE_FALSE) {
      return GameHelper.calScore(
        time,
        this.getTimeScope(),
        this.getTimeMax(),
        this.getScorePerQuestion()
      );
    }
    return 0;
  }

  /**
   * @param {number} time - เวลาที่เล่นเกมส์ได้ (วินาที)
   * @param {number} timeMin - กำหนดเวลาที่สามารถให้คะแนนได้ น้อยสุด (วินาที)
   * @param {number} timeMax - กำหนดเวลาที่สามารถให้คะแนนได้ มากสุด (วินาที)
   * @param {number} initailScore - ค่าเริ่มต้นคะแนนเต็ม ในแต่ล่ะข้อ
   * @returns {number} คะแนนต่อข้อ
   */
  public static calScore(
    time: number,
    timeMin: number,
    timeMax: number,
    initailScore: number = 100
  ): number {
    if (time < timeMin) {
      return initailScore;
    }
    const score = Math.round((1 - time / timeMax / 2) * initailScore);
    return score < 0 ? 0 : score;
  }

  public static convertToTime(time: number) {
    return `${Math.floor(time / 60)}`.padStart(2, "0") + ":" + (time % 60 ? `${time % 60}`.padStart(2, "0") : '00')
  }

  public static animateCount(start: number, end: number, duration: number, callback: TAnimateCountFunction) {
    if (start === end) return;
    let range = end - start;
    let current = start;
    let increment = end > start? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    console.log(stepTime);
    let timer = setInterval(function() {
        current += increment;
        callback(current);
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}
}
