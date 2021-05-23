import * as matter from 'matter-js';
import {
  BallForceModel,
  BallLengthEnum,
  BowlerSpeedEnum,
} from './BaseDataClass';

export class Ball {
  body: matter.Body;
  constructor() {
    this.body = matter.Bodies.circle(420 - 88, 137, 4, {
      isSensor: true,
      render: {
        fillStyle: 'transparent',
      },
    });
    this.body.mass = 5;
    this.body.restitution = 1.2;
    this.body.timeScale = 0.5;
    this.body.frictionAir = 0.02;
  }

  bowl(
    speed: BowlerSpeedEnum,
    ballForceConfig: BallForceModel
  ): BallLengthEnum {
    this.body.mass = ballForceConfig.mass;
    this.body.render.fillStyle = 'red';
    if (
      speed == BowlerSpeedEnum.Slow &&
      ballForceConfig.ballLength == BallLengthEnum.Yorker
    ) {
      this.body.restitution = 0.8;
    } else {
      this.body.restitution = 1.2;
    }
    matter.Body.setPosition(this.body, { x: 420 - 88, y: 137 });
    matter.Body.setVelocity(this.body, { x: 0, y: 0 });
    matter.Body.applyForce(
      this.body,
      { x: 420 - 88, y: 137 },
      { x: ballForceConfig.forceX, y: ballForceConfig.forceY }
    );
    return ballForceConfig.ballLength;
  }
}

export class Bat {
  body: matter.Body;

  constructor() {
    this.body = matter.Bodies.rectangle(50, 155, 10, 110, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        visible: true,
      },
    });
  }
}

export const WicketOptions = {
  isStatic: true,
  isSensor: true,
  render: {
    fillStyle: 'black',
    visible: true,
  },
};

export const GroundOptions = {
  isStatic: true,
  render: { fillStyle: 'transparent' },
};

export const RenderOptions = {
  width: 420,
  height: 210,
  background: 'transparent',
  wireframeBackground: 'transparent',
  wireframes: false,
};
