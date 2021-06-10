import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BattingDifficultyEnum,
  BowlerSpeedEnum,
  BowlingOptionsModel,
  BattingOptionsModel,
  BallLengthEnum,
  Player,
  OpponentScoreState,
  BallForceModel,
  BaseDataClass,
} from '../models/BaseDataClass';
import {
  Ball,
  Bat,
  RenderOptions,
  GroundOptions,
  WicketOptions,
} from '../models/PlayGroundBodies';
import { SocketService } from '../services/socket.service';

import * as matter from 'matter-js';
import { ActivatedRoute, Router } from '@angular/router';
import { batAnimation, bowlerAnimation } from '../models/AnimationsData';
import { Team } from 'src/app/shared/models/Team';
import { MatchResult } from '../models/MatchResult';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  animations: [batAnimation, bowlerAnimation],
})
export class PlaygroundComponent
  extends BaseDataClass
  implements AfterViewInit
{
  @ViewChild('playArea') playArea: ElementRef<any>;

  battingDifficultyEnum = BattingDifficultyEnum;
  bowlerSpeedEnum = BowlerSpeedEnum;

  isBatSwing: boolean = false;
  isBowled: boolean = false;
  playedCurrentBall: boolean;

  engine: matter.Engine;
  ball: Ball = new Ball();
  bat: Bat = new Bat();
  ground: matter.Body;
  wicket: matter.Body;

  timming: number = 0;
  timmingInterval;

  lastBallScore: string;
  timmingValue: number = 230;

  currentOverScores: string[] = [];

  currentBowler: BowlingOptionsModel;
  allOpponentBowlers: BowlingOptionsModel[];
  currentBatsman: BattingOptionsModel;
  allBattingOptions: BattingOptionsModel[];
  currentBallLength: BallLengthEnum;

  myTeam: Team;

  opponentTeam: Team;

  opponentScoreState: OpponentScoreState = {
    currentBall: 0,
    currentOver: 1,
    currentOverScores: [],
    totalScore: 0,
    wickets: 0,
  };

  currentOver: number = 1;
  currentBall: number = 1;

  bowlingInterval;
  opponentBowlingInterval;

  totalScore: number = 0;
  totalWickets: number = 0;

  isInningOver: boolean = false;

  batBallBarValue: number = 0;

  waitingSnackbar: MatSnackBarRef<any>;

  isSinglePlayer: boolean = true;

  constructor(
    private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    super();

    document.addEventListener('keypress', (event) => {
      if (event['charCode'] == 32) {
        this.swingBat();
      }
    });

    if (!this.isSinglePlayer) {
      this.socketService.socket.on(
        'update-score',
        (score: OpponentScoreState) => {
          this.opponentScoreState = score;
          this.checkIsMatchOver();
        }
      );
    }
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      (data: { squads: { myTeam: Team; opponentTeam: Team } }) => {
        this.myTeam = data.squads.myTeam;

        this.myTeam.squad = this.myTeam.squad
          .sort((a, b) => {
            return (a.order || 12) - (b.order || 12);
          })
          .slice(0, 11);

        this.opponentTeam = data.squads.opponentTeam;
        this.opponentTeam.squad = this.opponentTeam.squad
          .sort((a, b) => {
            return (a.order || 12) - (b.order || 12);
          })
          .slice(0, 11);
        this.allOpponentBowlers = this.opponentTeam.squad
          .filter((x) => x.bowlingRating > 0)
          .map((x) => {
            let b: BowlingOptionsModel = {
              ...x,
              hasBowled: false,
            };
            return b;
          });

        this.allBattingOptions = this.myTeam.squad.map((x) => {
          return {
            ...x,
            hasBatted: false,
          };
        });
        this.currentBatsman = this.getNextBatsman();
        this.currentBowler = this.getNextbowler();
        this.updateDifficulty();

        this.updateScore();
        this.updateOpponentScore();
      }
    );
  }

  updateScore() {
    let score: OpponentScoreState = {
      currentBall: this.currentBall,
      currentOver: this.currentOver,
      currentOverScores: this.currentOverScores,
      totalScore: this.totalScore,
      wickets: this.totalWickets,
    };

    if (!this.isSinglePlayer) {
      this.socketService.socket.emit('send-score', {
        roomId: this.socketService.roomId,
        score,
      });
    }

    if (this.totalWickets == 10) {
      this.isInningOver = true;
      clearInterval(this.bowlingInterval);
      this.startOpponentBowlingInterval();
      this.checkIsMatchOver();
      return;
    }
  }

  startOpponentBowlingInterval() {
    if (this.isInningOver && !this.opponentBowlingInterval) {
      this.opponentBowlingInterval = setInterval(() => {
        if (this.opponentScoreState.totalScore > this.totalScore) {
          let matchResult: MatchResult = {
            myScore: this.totalScore,
            myTeam: this.myTeam,
            opponentScore: this.opponentScoreState.totalScore,
            opponentTeam: this.opponentTeam,
          };
          this.router.navigateByUrl('/home/match-result', {
            state: { matchResult },
          });
          clearInterval(this.opponentBowlingInterval);
          this.waitingSnackbar?.dismiss();
        }

        if (this.opponentScoreState.currentBall == 6) {
          this.opponentScoreState.currentOverScores = [];
          if (this.currentOver == 5) {
            clearInterval(this.opponentBowlingInterval);
            this.checkIsMatchOver();
          } else {
            this.currentOver++;
            this.currentBall = 1;
          }
        } else {
          this.currentBall++;
        }
        this.updateOpponentScore();
      }, 2000);
    }
  }

  updateOpponentScore() {
    if (!this.opponentScoreState) {
      this.opponentScoreState = {
        currentBall: this.currentBall,
        currentOver: this.currentOver,
        currentOverScores: this.currentOverScores,
        totalScore: this.totalScore,
        wickets: this.totalWickets,
      };
    }

    this.opponentScoreState.currentBall = this.currentBall;
    this.opponentScoreState.currentOver = this.currentOver;
    this.calculateOpponentScore(Math.floor(Math.random() * (90 - 0 + 1) + 0));
    this.checkIsMatchOver();
  }

  calculateOpponentScore(timming: number) {
    if (
      timming <= this.oneRunTime.offset + this.oneRunTime.time ||
      timming > 230 - this.oneRunTime.offset - this.oneRunTime.time
    ) {
      this.opponentScoreState.currentOverScores[
        this.opponentScoreState.currentBall - 1
      ] = '1';
      this.opponentScoreState.totalScore++;
    } else if (
      timming <= this.twoRunTime.offset + this.twoRunTime.time ||
      timming > 230 - this.twoRunTime.offset - this.twoRunTime.time
    ) {
      if (
        this.currentBowler.bowlerSpeed == BowlerSpeedEnum.Slow &&
        timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
      ) {
        this.opponentScoreState.wickets++;
        this.opponentScoreState.currentOverScores[
          this.opponentScoreState.currentBall - 1
        ] = 'W';
      } else {
        this.opponentScoreState.totalScore += 2;
        this.opponentScoreState.currentOverScores[
          this.opponentScoreState.currentBall - 1
        ] = '2';
      }
    } else if (
      timming <= this.threeRunTime.offset + this.threeRunTime.time ||
      timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
    ) {
      if (timming > 230 - this.threeRunTime.offset - this.threeRunTime.time) {
        this.opponentScoreState.wickets++;
        this.opponentScoreState.currentOverScores[
          this.opponentScoreState.currentBall - 1
        ] = 'W';
      } else {
        this.opponentScoreState.totalScore += 3;
        this.opponentScoreState.currentOverScores[
          this.opponentScoreState.currentBall - 1
        ] = '3';
      }
    } else if (
      timming <= this.fourRunTime.offset + this.fourRunTime.time ||
      timming > 230 - this.fourRunTime.offset - this.fourRunTime.time
    ) {
      if (
        this.currentBowler.bowlerSpeed == BowlerSpeedEnum.Slow &&
        timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
      ) {
        this.opponentScoreState.wickets++;
        this.opponentScoreState.currentOverScores[
          this.opponentScoreState.currentBall - 1
        ] = 'W';
      } else {
        this.opponentScoreState.totalScore += 4;
        this.opponentScoreState.currentOverScores[
          this.opponentScoreState.currentBall - 1
        ] = '4';
      }
    } else if (
      timming <= this.sixRunTime.offset + this.sixRunTime.time &&
      timming > 230 - this.sixRunTime.offset - this.sixRunTime.time
    ) {
      this.opponentScoreState.currentOverScores[
        this.opponentScoreState.currentBall - 1
      ] = '6';
      this.opponentScoreState.totalScore += 6;
    }
  }

  updateDifficulty() {
    let difficulty: BattingDifficultyEnum;
    let difference =
      this.currentBatsman.battingRating - this.currentBowler.bowlingRating;

    switch (difference) {
      case 2:
        difficulty = BattingDifficultyEnum.VeryEasy;
        this.batBallBarValue = (5 / 6) * 100;
        break;
      case 1:
        difficulty = BattingDifficultyEnum.Easy;
        this.batBallBarValue = (4 / 6) * 100;
        break;
      case 0:
        difficulty = BattingDifficultyEnum.Normal;
        this.batBallBarValue = (3 / 6) * 100;
        break;
      case -1:
        difficulty = BattingDifficultyEnum.Difficult;
        this.batBallBarValue = (2 / 6) * 100;
        break;
      case -2:
        difficulty = BattingDifficultyEnum.Hard;
        this.batBallBarValue = (1 / 6) * 100;
        break;
      case -3:
        difficulty = BattingDifficultyEnum.VeryHard;
        this.batBallBarValue = (0 / 6) * 100;
        break;
    }

    this.updateTimmingRange(difficulty, this.currentBowler.bowlerSpeed);
  }

  getNextBatsman(): BattingOptionsModel {
    let availableBatsmen = this.allBattingOptions.filter((x) => !x.hasBatted);
    if (availableBatsmen.length <= 1) {
      return;
    }
    let nextBatsman = availableBatsmen[0];
    this.allBattingOptions.find((x) => x._id == nextBatsman._id).hasBatted =
      true;

    return nextBatsman;
  }

  getNextbowler() {
    let nextBowler = this.allOpponentBowlers
      .filter((x) => !x.hasBowled)
      .sort((a, b) => {
        return b.bowlingRating - a.bowlingRating;
      })[0];

    this.allOpponentBowlers.find((x) => x._id == nextBowler._id).hasBowled =
      true;

    return nextBowler;
  }

  ngAfterViewInit(): void {
    this.engine = matter.Engine.create();

    let render = matter.Render.create({
      element: this.playArea.nativeElement,
      engine: this.engine,
      options: RenderOptions,
    });

    matter.Runner.create({
      isFixed: true,
    });

    this.ground = matter.Bodies.rectangle(420 / 2, 210, 420, 10, GroundOptions);

    this.wicket = matter.Bodies.rectangle(10, 187, 4, 46, WicketOptions);

    this.toggleBat(-1);

    matter.World.add(this.engine.world, [
      this.wicket,
      this.bat.body,
      this.ball.body,
      this.ground,
    ]);

    matter.Engine.run(this.engine);
    matter.Render.run(render);

    this.handleCollissionEvents();

    let self = this;
    this.bowlingInterval = setInterval(() => {
      let ballForceConfig = new BallForceModel(this.currentBowler.bowlerSpeed);
      this.currentBallLength = ballForceConfig.ballLength;

      if (!self.isInningOver) self.bowl(ballForceConfig);

      if (this.currentBall == 6) {
        this.currentOverScores = [];
        if (this.isSinglePlayer) {
          this.opponentScoreState.currentOverScores = [];
        }
        if (this.currentOver == 5) {
          this.isInningOver = true;
          clearInterval(this.bowlingInterval);
          this.checkIsMatchOver();
          this.updateScore();
        } else {
          this.currentOver++;
          this.currentBall = 1;
          this.currentBowler = this.getNextbowler() || this.currentBowler;
          if (this.currentBowler && this.currentBatsman)
            this.updateDifficulty();
        }
      } else {
        this.currentBall++;
      }
      if (this.isSinglePlayer) {
        this.updateOpponentScore();
      }
    }, 3000);
  }

  handleCollissionEvents() {
    let self = this;
    matter.Events.on(this.engine, 'collisionStart', function (event) {
      var pair = [...event.pairs][0];

      if (
        ((pair.bodyA.id == self.ball.body.id &&
          pair.bodyB.id == self.wicket.id) ||
          (pair.bodyA.id == self.wicket.id &&
            pair.bodyB.id == self.ball.body.id)) &&
        !self.isInningOver
      ) {
        self.lastBallScore = 'Bowled';
        self.currentOverScores[self.currentBall - 1] = 'W';
        self.totalWickets++;
        self.currentBatsman = self.getNextBatsman() || self.currentBatsman;
        if (self.currentBowler && self.currentBatsman) self.updateDifficulty();
      }

      if (
        (pair.bodyA.id == self.ball.body.id &&
          pair.bodyB.id == self.bat.body.id) ||
        (pair.bodyA.id == self.bat.body.id &&
          pair.bodyB.id == self.ball.body.id)
      ) {
        self.hitBall();
      }

      self.updateScore();
    });
  }

  hitBall() {
    let self = this;

    self.playedCurrentBall = true;
    self.stopTimer();

    let velocityVector: matter.Vector;

    if (
      self.timming <= this.oneRunTime.offset + this.oneRunTime.time ||
      self.timming > 230 - this.oneRunTime.offset - this.oneRunTime.time
    ) {
      self.lastBallScore = '1';
      self.currentOverScores[self.currentBall - 1] = '1';
      this.totalScore++;
      velocityVector = { x: 3, y: 0.1 };
    } else if (
      self.timming <= this.twoRunTime.offset + this.twoRunTime.time ||
      self.timming > 230 - this.twoRunTime.offset - this.twoRunTime.time
    ) {
      self.lastBallScore =
        self.currentBowler.bowlerSpeed == BowlerSpeedEnum.Slow &&
        self.timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
          ? this.totalWickets++ &&
            (this.currentBatsman = this.getNextBatsman()) &&
            (self.currentOverScores[self.currentBall - 1] = 'W')
            ? 'CAUGHT'
            : null
          : (this.totalScore += 2) &&
            (self.currentOverScores[self.currentBall - 1] = '2')
          ? '2'
          : null;
      velocityVector = {
        x: 6,
        y:
          self.timming > 230 - this.twoRunTime.offset - this.twoRunTime.time
            ? -6
            : 0,
      };
    } else if (
      self.timming <= this.threeRunTime.offset + this.threeRunTime.time ||
      self.timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
    ) {
      self.lastBallScore =
        self.timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
          ? this.totalWickets++ &&
            (this.currentBatsman = this.getNextBatsman()) &&
            (self.currentOverScores[self.currentBall - 1] = 'W')
            ? 'CAUGHT'
            : null
          : (this.totalScore += 3) &&
            (self.currentOverScores[self.currentBall - 1] = '3')
          ? '3'
          : null;
      velocityVector = {
        x: 10,
        y:
          self.timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
            ? -7
            : 0,
      };
    } else if (
      self.timming <= this.fourRunTime.offset + this.fourRunTime.time ||
      self.timming > 230 - this.fourRunTime.offset - this.fourRunTime.time
    ) {
      self.lastBallScore =
        self.currentBowler.bowlerSpeed == BowlerSpeedEnum.Slow &&
        self.timming > 230 - this.threeRunTime.offset - this.threeRunTime.time
          ? this.totalWickets++ &&
            (this.currentBatsman = this.getNextBatsman()) &&
            (self.currentOverScores[self.currentBall - 1] = 'W')
            ? 'CAUGHT'
            : null
          : (this.totalScore += 4) &&
            (self.currentOverScores[self.currentBall - 1] = '4')
          ? '4'
          : null;
      velocityVector = {
        x: 15,
        y:
          self.timming > 230 - this.fourRunTime.offset - this.oneRunTime.time
            ? -15
            : 0,
      };
    } else if (
      self.timming <= this.sixRunTime.offset + this.sixRunTime.time &&
      self.timming > 230 - this.sixRunTime.offset - this.sixRunTime.time
    ) {
      self.lastBallScore = '6';
      self.currentOverScores[self.currentBall - 1] = '6';
      this.totalScore += 6;
      velocityVector = { x: 20, y: -12 };
      velocityVector;
    }

    if (self.currentBowler && self.currentBatsman) self.updateDifficulty();

    self.timmingValue = self.timming;

    matter.Body.setVelocity(self.ball.body, velocityVector);

    self.updateScore();
  }

  bowl(ballForceConfig: BallForceModel) {
    this.ball.body.isSensor = false; // to prevent first ball collistion
    this.isBowled = true;

    if (!this.playedCurrentBall) {
      this.timming = 0;
    }

    this.playedCurrentBall = false;

    this.lastBallScore = '';
    this.timmingValue = 230;

    setTimeout(() => {
      this.ball.bowl(this.currentBowler.bowlerSpeed, ballForceConfig);
      this.isBowled = false;

      console.log('Check', this.isInningOver);
      console.log('ball', this.currentBall);
      console.log('over', this.currentOver);
      console.log('wicket', this.totalWickets);
    }, 500);
  }

  swingBat() {
    this.isBatSwing = true;
    this.toggleBat(1);
    this.startTimer();

    setTimeout(() => {
      this.isBatSwing = false;
      this.toggleBat(-1);
    }, 230);
  }

  toggleBat(group: number) {
    this.bat.body.collisionFilter.group = group;
    this.ball.body.collisionFilter.group = group;
  }

  getLengthIndicatorPosition() {
    switch (this.currentBallLength) {
      case BallLengthEnum.Bouncer:
        return 200;
      case BallLengthEnum.Short:
        return 150;
      case BallLengthEnum.Good:
        return 100;
      case BallLengthEnum.Yorker:
        return 35;
    }
  }

  startTimer() {
    this.timming = 0;
    let self = this;
    this.timmingInterval = setInterval(function () {
      self.timming++;
    }, 1);
  }

  stopTimer() {
    clearInterval(this.timmingInterval);
  }

  checkIsMatchOver() {
    if (
      this.totalWickets == 10 ||
      (this.currentOver == 5 && this.currentBall == 6)
    ) {
      if (
        this.opponentScoreState.wickets == 10 ||
        (this.opponentScoreState.currentOver == 5 &&
          this.opponentScoreState.currentBall == 6)
      ) {
        this.lastBallScore = 'Match Over';
        if (!this.isSinglePlayer) {
          this.socketService.socket.emit('match-over', {
            roomId: this.socketService.roomId,
          });
        }
        let matchResult: MatchResult = {
          myScore: this.totalScore,
          myTeam: this.myTeam,
          opponentScore: this.opponentScoreState.totalScore,
          opponentTeam: this.opponentTeam,
        };
        this.router.navigateByUrl('/home/match-result', {
          state: { matchResult },
        });
        this.waitingSnackbar?.dismiss();
      } else {
        this.lastBallScore = '';
        if (!this.waitingSnackbar)
          this.waitingSnackbar = this._snackBar.open('Waiting for Opponrnt...');
      }
    }
  }
}

//continue opponent innings when users over are over in single playe
