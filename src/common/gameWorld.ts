import { Vec2, World } from "planck";
import { Car } from "./car/car";
import { CheckPoint } from "./courses/checkPoint";
import { Course, CourseId, Course01 } from "./courses/course";

export class GameWorld {
    readonly world = new World({ gravity: new Vec2(0, 0) });
    readonly course: Course;
    private _totalSec = 0;

    constructor(courseId: CourseId) {
        this.course = Course.fromId(courseId, this.world);

        this.world.on("begin-contact", e => {
            const aUserData = e.getFixtureA().getUserData();
            const bUserData = e.getFixtureB().getUserData();
            if (aUserData instanceof Car) {
                if (bUserData instanceof CheckPoint) {
                    aUserData.onCheckPoint(bUserData.index, this._totalSec, this.course.checkPointCount);
                }
            } else if (bUserData instanceof Car) {
                if (aUserData instanceof CheckPoint) {
                    bUserData.onCheckPoint(aUserData.index, this._totalSec, this.course.checkPointCount);
                }
            }
        });
    }

    get totalSec() { return this._totalSec; }

    step(deltaSec: number) {
        deltaSec = Math.min(deltaSec, 1 / 30); // 30FPS以下にならないように
        this._totalSec += deltaSec;
        this.world.step(deltaSec);
    }

    resetTotalSec() { this._totalSec = 0; }
}