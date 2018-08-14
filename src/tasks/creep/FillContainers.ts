import { CreepTaskRequest } from "tasks/CreepTaskRequest";
import { CreepTask } from "tasks/CreepTask";
import { CreepTaskQueue } from "tasks/CreepTaskQueue";
import { Traveler } from "Traveler";
import { roomManager } from "RoomManager";

export class FillContainersRequest extends CreepTaskRequest {
  name: string = "FillContainers";
  priority: number = 1;
  validRoles: CreepRole[] = ["ROLE_CARRIER"];
  maxConcurrent: number = 1;
  constructor(roomName: string, targetRoomName: string, restockID: string) {
    super(roomName, targetRoomName, restockID, `💰2`);
  }
}

export class FillContainers extends CreepTask {
  static taskName: string = "FillContainers";
  protected init(): void {
    super.init();
    this.request.status = "PREPARE";
  }

  protected prepare(): void {
    super.prepare();
    if (this.request.status != "PREPARE") return;
    //const restockInfo = this.request as FillStorageRequest;
    var room = Game.rooms[this.request.targetRoomName];

    if (this.creep.carry.energy == this.creep.carryCapacity) {
      this.request.status = "IN_PROGRESS";
      return;
    }
    this.fillup();

  }
  private fillup(): void {
    var room = Game.rooms[this.request.originatingRoomName];
    if (this.collectFromTombstone(room.name)) return;
    else if (this.collectFromDroppedEnergy(room.name)) return;
    else if (this.collectFromMasterLink(room.name)) return;
    else if (this.collectFromStorage(room.name)) return;
    else if (this.collectFromContainer(room.name)) return;
  }
  protected work(): void {
    super.work();
    if (this.request.status != "IN_PROGRESS") return;

    //const creep = Game.creeps[this.request.assignedTo];
    var room = Game.rooms[this.request.targetRoomName];

    var cMem = _.find(roomManager.getContainers2(this.request.targetRoomName), c => {
      var container = <StructureContainer>Game.getObjectById(c.id);
      return container.store.energy < container.storeCapacity
        && c.shouldRefill;
    });
    if (cMem == undefined) {
      this.request.status = "FINISHED";
      return;
    }
    var container = <StructureContainer>Game.getObjectById(cMem.id);
    
    const result = this.creep.transfer(container, RESOURCE_ENERGY)
    if (result == ERR_NOT_IN_RANGE) this.creep.travelTo(container);
    else this.request.status = "FINISHED";

    //var container = Game.getObjectById(cMem.id);
    

    //let containersToFill = room.find(FIND_STRUCTURES)
    //  .filter(s => (s.structureType == "container"
    //    && s.store.energy < s.storeCapacity
    //    && s.shouldRefill));

    //if (containersToFill.length == 0) {
    //  this.request.status = "FINISHED";
    //  return;
    //}

    //const closest = _.first(_.sortBy(containersToFill, s => this.creep.pos.getRangeTo(s)))

    //const result = this.creep.transfer(closest, RESOURCE_ENERGY)
    //if (result == ERR_NOT_IN_RANGE) this.creep.travelTo(closest);
    //else this.request.status = "FINISHED";
  }
  constructor(taskInfo: CreepTaskRequest) {
    super(taskInfo);
  }
  static addRequests(roomName: string) {

    const room = Game.rooms[roomName];
    const roomMem = room.memory as RoomMemory;
    //let storages = room.find(FIND_MY_STRUCTURES).filter(s => s.structureType == "storage") as StructureStorage[];
    const containers = roomManager.getContainers2(roomName).filter(cm => {
      var cont = <StructureContainer>Game.getObjectById(cm.id);
      return cont.store.energy < cont.storeCapacity
        && cm.shouldRefill;
    });



    //let containersToFill = con
    //  .filter(s => (s.structureType == "container"
    //    && s.store.energy < s.storeCapacity
    //    && s.shouldRefill));

    if (containers.length == 0) return;
    //let workers = utils.creepNamesByRole(roomName,"ROLE_WORKER").filter(name => {
    //  const worker = Game.creeps[name] as Creep;
    //  return worker.carry.energy > 0;
    //})
    //if (workers.length == 0) return;
    let existingTaskCount = CreepTaskQueue.count(roomName, "FillContainers");
    let maxConcurrentCount = 1; //todo

    //for (var i = existingTaskCount; i < maxConcurrentCount;) {
    //  _.each(containersToFill, c => {
    //    CreepTaskQueue.addPendingRequest(new FillContainersRequest(roomName, roomName, c.id))
    //    i++;
    //  });
    //}
    _.forEach(containers, c => {
      let request = new FillContainersRequest(roomName, roomName, c.id);
      if (existingTaskCount < maxConcurrentCount) {
        CreepTaskQueue.addPendingRequest(request)
      }
    })
    //for (const targetID in containers) {
    //  let request = new FillContainersRequest(roomName, roomName, targetID);
    //  if (existingTaskCount < maxConcurrentCount) {
    //    CreepTaskQueue.addPendingRequest(request)
    //  }
    //}
  }
}