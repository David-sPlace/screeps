import { CreepTask } from "tasks/CreepTask";
import { CreepTaskRequest } from "tasks/CreepTaskRequest";
import { CreepTaskQueue } from "tasks/CreepTaskQueue";
import * as utils from "utils/utils";
import { roomManager } from "RoomManager";

export class ScoutRequest extends CreepTaskRequest {

  priority: number = 2;
  validRoles: CreepRole[] = ["ROLE_SCOUT"];
  name = "Scout";

  static maxPerRoom: number = 1;
  scoutMode: ScoutMode;

  constructor(originatingRoomName: string, targetRoomName: string, scoutMode: ScoutMode) {
    super(originatingRoomName, targetRoomName, targetRoomName, `👀`);

    this.scoutMode = scoutMode;
  }
}
export class Scout extends CreepTask {
  constructor(taskInfo: CreepTaskRequest) {
    super(taskInfo);
  }
  static taskName: string = "Scout";
  protected init(): void {
    super.init();
    this.request.status = "PREPARE";
  }

  protected prepare(): void {
    super.prepare();
    if (this.request.status != "PREPARE") return;

    if (this.creep.room.name == this.request.targetRoomName) {
      this.request.status = "IN_PROGRESS";
    }

  }
  protected work(): void {
    super.work();
    if (this.request.status != "IN_PROGRESS") return;

    const request = <ScoutRequest>this.request;
    const controller = this.creep.room.controller as StructureController;
    let result = 0;
    switch (request.scoutMode) {
      case "CLAIM": result = this.creep.claimController(controller); break;
      case "RESERVE": result = this.creep.reserveController(controller); break;
      case "SCOUT": result = OK; //TODO
    }
    if (result == ERR_NOT_IN_RANGE) this.creep.travelTo(controller);

  }

  static addRequests(roomName: string): void {

    var blueFlags = utils.findFlags(undefined, COLOR_BLUE, roomName);
    if (blueFlags.length != 1) return;

    var scoutFlag = _.first(blueFlags);
    var originatingRoom = roomName;
    var targetRoomName = scoutFlag.pos.roomName;

    if (Game.rooms[originatingRoom] == undefined) throw Error("Originating room cannot be undefined... in Scout::addrequests");

    var currentActive = CreepTaskQueue.activeTasks(originatingRoom, "Scout", targetRoomName).length;
    var currentPending = CreepTaskQueue.count(originatingRoom, "Scout", targetRoomName, "PENDING");

    if (currentActive + currentPending >= 1) return;

    var scoutMode: ScoutMode = scoutFlag.secondaryColor == COLOR_BLUE ? "CLAIM"
      : scoutFlag.secondaryColor == COLOR_WHITE ? "RESERVE"
        : "SCOUT";
    console.log("addin scout req")
    CreepTaskQueue.addPendingRequest(new ScoutRequest(originatingRoom, targetRoomName, scoutMode));

  }
  

}

//export class ScoutRequest extends CreepTaskRequest {
//  priority: number = 2;
//  validRoles: CreepRole[] = ["ROLE_SCOUT"];
//  name = "Scout";
//  maxConcurrent = 3;
//  maxPerRoom = 1;
//  claiming: boolean = false;
//  reserving: boolean = false;
//  constructor(sourceRoomName: string, targetRoomName: string, claiming: boolean = false, reserving: boolean = false) {
//    super(sourceRoomName, `👀`, targetRoomName, targetRoomName);
//    this.claiming = claiming;
//    this.reserving = reserving;
//    this.targetID = targetRoomName;
//  }
//}
//export class Scout extends CreepTask {

//  protected init(): void {
//    super.init();
//    this.request.status = "PREPARE";
//  }

//  protected prepare(): void {
//    super.prepare();
//    if (this.request.status == "FINISHED") return;

//    //var scoutFlagID = this.request.targetID;
//    //var flags = Game.flags;
//    //var ourFlag = flags[scoutFlagID] as Flag;
//    //if (ourFlag == undefined) {
//    //  throw Error("Flag was undefined?")
//    //}

//    //var targetPos = ;
//    if (this.creep.room.name != this.request.targetRoomName) {
//      this.creep.travelTo(new RoomPosition(25, 25, this.request.targetRoomName));
//    }
//    else {
//      this.request.status = "IN_PROGRESS";
//    }

//  }
//  protected work(): void {
//    super.work();
//    if (this.request.status == "FINISHED") return;
//    const creep = Game.creeps[this.request.assignedTo];
//    var req = this.request as ScoutRequest;
//    //creep.say("got here!");
//    var controller = creep.room.controller as StructureController;
//    if (controller == undefined) throw new Error("Can't put a claim flag in a room w/o a controller... derp");

//    var result = req.claiming ? creep.claimController(controller)
//      : req.reserving ? creep.reserveController(controller)
//        : OK;
//    if (result == ERR_NOT_IN_RANGE) {
//      creep.moveTo(controller)
//    }

//  }

//  static addRequests(roomName: string): void {

//    //var room = Game.rooms[this.creep.room.name];
//    var flags = Game.flags;
//    for (var id in flags) {
//      var flag = flags[id] as Flag;
//      //blue/blue = scout, blue/white  = claim
//      if (flag.color == COLOR_BLUE) {
//        var targetRoomName = flag.pos.roomName;
//        var sourceRoomName = flag.name;

//        if (sourceRoomName != roomName) continue;

//        var request = new ScoutRequest(sourceRoomName, targetRoomName)
//        var currentActive = CreepTaskQueue.active(roomName, request.name, targetRoomName).length;
//        var currentPending = CreepTaskQueue.pending(roomName, request.name, targetRoomName).length;

//        //console.log("Current Scout task count for " + roomName + ": " + count)
//        if (currentActive + currentPending > 0) return;

//        if (flag.secondaryColor == COLOR_BLUE) {
//          request.claiming = true;
//          CreepTaskQueue.addPendingRequest(request);
//        }
//        else if (flag.secondaryColor == COLOR_WHITE) {
//          request.reserving = true;
//          CreepTaskQueue.addPendingRequest(request);
//        }
//      }

//    }

//  }
//  constructor(taskInfo: CreepTaskRequest) {
//    super(taskInfo);
//  }

//}
