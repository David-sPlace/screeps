import { CreepTaskRequest } from "tasks/CreepTaskRequest";
import { CreepTask } from "tasks/CreepTask";
import { CreepTaskQueue } from "tasks/CreepTaskQueue";
import { Traveler } from "Traveler";

export class FillContainersRequest extends CreepTaskRequest {
  name: string = "FillContainers";
  priority: number = 1;
  requiredRole: CreepRole[] = ["ROLE_CARRIER"];
  maxConcurrent: number = 1;
  constructor(roomName: string, restockID: string) {
    super(roomName, `💰2`, restockID);
  }

}

export class FillContainers extends CreepTask {

  protected init(): void {
    super.init();

    //var fillStorage = this.request as FillContainersRequest;

    //console.log("status after init" + Task.getStatus(this.request.status))
    this.request.status = "PREPARE";
  }

  protected prepare(): void {
    super.prepare();
    if (this.request.status == "FINISHED") return;
    //const restockInfo = this.request as FillStorageRequest;
    var room = Game.rooms[this.request.roomName];

    if (this.creep.carry.energy == this.creep.carryCapacity) {
      this.request.status = "IN_PROGRESS";
      return;
    }

    if (this.collectFromTombstone(room.name)) return;
    else if (this.collectFromDroppedEnergy(room.name)) return;
    else if (this.collectFromMasterLink(room.name)) return;
    else if (this.collectFromStorage(room.name)) return;
    else if (this.collectFromContainer(room.name)) return;

  }
  protected continue(): void {
    super.continue();
    if (this.request.status == "FINISHED") return;
    //const creep = Game.creeps[this.request.assignedTo];
    var room = Game.rooms[this.request.roomName];
    var roomMem = room.memory as RoomMemory;
    let storages = room.find(FIND_STRUCTURES).filter(s => {
      if (s.structureType == "container" && s.store.energy < s.storeCapacity) {
        var smartContainer = roomMem.containers[s.id];
        return smartContainer.shouldFill;
      }
      return false;
    }) as StructureContainer[];
    if (storages.length == 0) {
      this.request.status = "FINISHED";
      return;
    }

    const closest = _.first(_.sortBy(storages, s => this.creep.pos.getRangeTo(s)))

    const result = this.creep.transfer(closest, RESOURCE_ENERGY)
    if (result == ERR_NOT_IN_RANGE) {
      Traveler.travelTo(this.creep, closest);
      //this.creep.moveTo(closest, { visualizePathStyle: { stroke: '#ffffff' } });
    }
    else {
      this.request.status = "FINISHED";
    }
    //else if (result == OK) {
    //  this.request.status = "FINISHED";
    //}
    //else {
    //  this.request.status = "FINISHED";
    //}
  }
  constructor(taskInfo: CreepTaskRequest) {
    super(taskInfo);
  }

  static addRequests(roomName: string) {

    const room = Game.rooms[roomName];
    const roomMem = room.memory as RoomMemory;
    //let storages = room.find(FIND_MY_STRUCTURES).filter(s => s.structureType == "storage") as StructureStorage[];
    let containers = room.find(FIND_STRUCTURES).filter(s => {
      if (s.structureType == "container" && s.store.energy < s.storeCapacity / 2) {
        var smartContainer = roomMem.containers[s.id];
        return smartContainer.shouldFill;
      }
      return false;
    }) as StructureContainer[];
    if (containers.length == 0) return;
    //let workers = utils.creepNamesByRole(roomName,"ROLE_WORKER").filter(name => {
    //  const worker = Game.creeps[name] as Creep;
    //  return worker.carry.energy > 0;
    //})
    //if (workers.length == 0) return;
    var reqTemplate = new FillContainersRequest(roomName, "")
    let existingTaskCount = CreepTaskQueue.totalCount(roomName, reqTemplate.name);
    let maxConcurrentCount = reqTemplate.maxConcurrent;

    for (var i = existingTaskCount; i < maxConcurrentCount;) {
      _.each(containers, c => {
        CreepTaskQueue.addPendingRequest(new FillContainersRequest(roomName, c.id))
        i++;
      });
    }


    for (const targetID in containers) {
      let restockable = containers[targetID];

      let request = new FillContainersRequest(roomName, restockable.id);


      if (existingTaskCount < maxConcurrentCount) {
        CreepTaskQueue.addPendingRequest(request)
      }
    }
  }
}