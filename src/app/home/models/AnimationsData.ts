import {
  trigger,
  transition,
  animate,
  keyframes,
  style,
} from '@angular/animations';

export const batAnimation = trigger('swingBat', [
  transition('initial => swing', [
    animate(
      '0.23s',
      keyframes([
        style({
          background: 'url(/assets/batsman.png) no-repeat',
          offset: 0,
        }),
        style({
          background: 'url(/assets/batsman2.png) no-repeat',
          offset: 0.6,
        }),
        style({
          background: 'url(/assets/batsman2.png) no-repeat',
          offset: 1,
        }),
      ])
    ),
  ]),
]);

export const bowlerAnimation = trigger('bowl', [
  transition('initial => bowl', [
    animate(
      '0.5s',
      keyframes([
        style({
          background: 'url(/assets/bowler1.png) no-repeat right',
          offset: 0,
        }),
        style({
          background: 'url(/assets/bowler2.png) no-repeat right',
          offset: 0.33,
        }),
        style({
          background: 'url(/assets/bowler3.png) no-repeat right',
          offset: 0.8,
        }),
        style({
          background: 'url(/assets/bowler4.png) no-repeat right',
          offset: 1,
        }),
      ])
    ),
  ]),
]);
