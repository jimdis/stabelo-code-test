import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

export const ELEVATOR_MOVED = "elevatorMoved";

export default eventEmitter;
