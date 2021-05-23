export class BaseDataClass {
  battingDifficulty: BattingDifficultyEnum;

  oneRunTime: TimeRunRangeModel = {
    time: null,
    offset: null,
  };
  twoRunTime: TimeRunRangeModel = {
    time: null,
    offset: null,
  };
  threeRunTime: TimeRunRangeModel = {
    time: null,
    offset: null,
  };
  fourRunTime: TimeRunRangeModel = {
    time: null,
    offset: null,
  };
  sixRunTime: TimeRunRangeModel = {
    time: null,
    offset: null,
  };

  timmingRanges: TimmingRangeModel[];

  constructor() {}

  updateTimmingRange(
    difficulty: BattingDifficultyEnum,
    bowlerSpeed: BowlerSpeedEnum
  ) {
    switch (difficulty) {
      case BattingDifficultyEnum.Difficult:
        this.oneRunTime.time = 60;
        this.twoRunTime.time = 20;
        this.threeRunTime.time = 20;
        this.fourRunTime.time = 10;
        this.sixRunTime.time = 10;
        break;

      case BattingDifficultyEnum.Normal:
        this.oneRunTime.time = 40;
        this.twoRunTime.time = 30;
        this.threeRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 25 : 10;
        this.fourRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 10 : 30;
        this.sixRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 20 : 10;
        break;

      case BattingDifficultyEnum.Easy:
        this.oneRunTime.time = 30;
        this.twoRunTime.time = 15;
        this.threeRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 30 : 10;
        this.fourRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 10 : 30;
        this.sixRunTime.time = 60;
        break;

      case BattingDifficultyEnum.VeryEasy:
        this.oneRunTime.time = 10;
        this.twoRunTime.time = 10;
        this.threeRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 40 : 20;
        this.fourRunTime.time = bowlerSpeed == BowlerSpeedEnum.Slow ? 20 : 40;
        this.sixRunTime.time = 70;
        break;

      case BattingDifficultyEnum.Hard:
        this.oneRunTime.time = 60;
        this.twoRunTime.time = 30;
        this.threeRunTime.time = 15;
        this.fourRunTime.time = 10;
        this.sixRunTime.time = 0;
        break;

      case BattingDifficultyEnum.VeryHard:
        this.oneRunTime.time = 83;
        this.twoRunTime.time = 20;
        this.threeRunTime.time = 10;
        this.fourRunTime.time = 2;
        this.sixRunTime.time = 0;
        break;
    }

    this.updateRunTimeOffset();
    this.setTimmingRanges();
  }

  updateRunTimeOffset() {
    this.oneRunTime.offset = 0;
    this.twoRunTime.offset = this.oneRunTime.offset + this.oneRunTime.time;
    this.threeRunTime.offset = this.twoRunTime.offset + this.twoRunTime.time;
    this.fourRunTime.offset = this.threeRunTime.offset + this.threeRunTime.time;
    this.sixRunTime.offset = this.fourRunTime.offset + this.fourRunTime.time;
  }

  setTimmingRanges() {
    this.timmingRanges = [
      {
        start: this.oneRunTime.offset,
        end: 230 - this.oneRunTime.offset - this.oneRunTime.time,
        color: 'red',
      },
      {
        start: this.twoRunTime.offset,
        end: 230 - this.twoRunTime.offset - this.twoRunTime.time,
        color: 'orange',
      },
      {
        start: this.threeRunTime.offset,
        end: 230 - this.threeRunTime.offset - this.threeRunTime.time,
        color: 'yellow',
      },
      {
        start: this.fourRunTime.offset,
        end: 230 - this.fourRunTime.offset - this.fourRunTime.time,
        color: 'yellowgreen',
      },
      {
        start: this.sixRunTime.offset,
        end: this.sixRunTime.offset,
        color: 'green',
      },
      {
        start: 230 - this.fourRunTime.offset - this.fourRunTime.time,
        end: this.fourRunTime.offset,
        color: 'yellowgreen',
      },
      {
        start: 230 - this.threeRunTime.offset - this.threeRunTime.time,
        end: this.threeRunTime.offset,
        color: 'yellow',
      },
      {
        start: 230 - this.twoRunTime.offset - this.twoRunTime.time,
        end: this.twoRunTime.offset,
        color: 'orange',
      },
      {
        start: 230 - this.oneRunTime.offset - this.oneRunTime.time,
        end: this.oneRunTime.offset,
        color: 'red',
      },
    ];
  }
}

export enum BattingDifficultyEnum {
  VeryEasy = 1,
  Easy,
  Normal,
  Difficult,
  Hard,
  VeryHard,
}

export interface TimeRunRangeModel {
  time: number;
  offset: number;
}

export interface TimmingRangeModel {
  start: number;
  end: number;
  color: string;
}

export enum BowlerSpeedEnum {
  Fast = 1,
  Slow,
}

export enum BallLengthEnum {
  Bouncer = 1,
  Short,
  Good,
  Yorker,
}

export class BallForceModel {
  forceX: number;
  forceY: number;
  mass: number;

  ballLength: BallLengthEnum;

  // fast
  //          x      y      mass
  //bouncer  -0.5    0.2    5
  //short    -0.45   0.045  5
  //good     -0.4    0.04   6.5
  //yorker   -0.6    0      6

  // slow
  //short    -0.4    0.04   5.5
  //good     -0.4    -0.1   6
  //yorker   -0.5    -0.2   7

  constructor(speed: BowlerSpeedEnum) {
    if (speed == BowlerSpeedEnum.Fast) {
      let ballLength = <BallLengthEnum>(
        Math.floor(Math.random() * (4 - 1 + 1) + 1)
      );
      this.ballLength = ballLength;
      switch (ballLength) {
        case BallLengthEnum.Bouncer:
          this.setForceValues(-0.5, 0.2, 5);
          break;
        case BallLengthEnum.Short:
          this.setForceValues(-0.45, 0.05, 5.5);
          break;
        case BallLengthEnum.Good:
          this.setForceValues(-0.5, 0.025, 5.5);
          break;
        case BallLengthEnum.Yorker:
          this.setForceValues(-0.6, -0.05, 6.2);
          break;
      }
    } else if (speed == BowlerSpeedEnum.Slow) {
      let ballLength = <BallLengthEnum>(
        Math.floor(Math.random() * (4 - 2 + 1) + 2)
      );
      this.ballLength = ballLength;
      switch (ballLength) {
        case BallLengthEnum.Short:
          this.setForceValues(-0.4, 0.04, 5.5);
          break;
        case BallLengthEnum.Good:
          this.setForceValues(-0.4, -0.1, 6);
          break;
        case BallLengthEnum.Yorker:
          this.setForceValues(-0.5, -0.23, 7);
          break;
      }
    }
  }

  setForceValues(x: number, y: number, mass: number) {
    this.forceX = x;
    this.forceY = y;
    this.mass = mass;
  }
}

export enum PlayerCategoryEnum {
  Gold = 1,
  Silver,
  Bronze,
}

export enum RatingEnum {
  OneStar = 1,
  TwoStar,
  ThreeStar,
}

export enum PlayerTypeEnum {
  Bowler = 1,
  Batsman,
  Allrounder,
}

export interface Player {
  _id?: string;
  name: string;
  team: string;
  bowlerSpeed: BowlerSpeedEnum;
  category: PlayerCategoryEnum;
  bowlingRating: 0 | 1 | 2 | 3;
  battingRating: 0 | 1 | 2 | 3;
  type: PlayerTypeEnum;
  isOverseas: boolean;
  isWicketKeeper?: boolean;
  isCaptain?: boolean;
  order?: number;
}

export interface BowlingOptionsModel extends Player {
  hasBowled: boolean;
}

export interface BattingOptionsModel extends Player {
  hasBatted: boolean;
}

export interface OpponentScoreState {
  totalScore: number;
  wickets: number;
  currentOverScores: string[];
  currentOver: number;
  currentBall: number;
}
