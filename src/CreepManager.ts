import * as utils from "utils/utils"
import { roomManager } from "RoomManager";
import { CreepTaskQueue } from "tasks/CreepTaskQueue";
//import { CreepTaskRequest } from "tasks/CreepTaskRequest";
export class CreepManager {
  
  
  static run(roomName: string) {
    CreepManager.spawnMissingCreeps(roomName);
  }
  static GetCreepParts(role: CreepRole, roomEnergyLevel: number): BodyPartConstant[] {

    switch (role) {
      case "ROLE_MINER": return CreepManager.getMinerBodyParts(roomEnergyLevel);
      case "ROLE_UPGRADER": return CreepManager.getUpgraderBodyParts(roomEnergyLevel);
      case "ROLE_WORKER": return CreepManager.getWorkerBodyParts(roomEnergyLevel);
      case"ROLE_SCOUT": return CreepManager.getScoutBodyParts(roomEnergyLevel);
      case"ROLE_CARRIER": return CreepManager.getCarrierBodyParts(roomEnergyLevel);
      case"ROLE_DEFENDER": return CreepManager.getDefenderBodyParts(roomEnergyLevel);
      case"ROLE_REMOTE_UPGRADER": return CreepManager.getRemoteUpgraderBodyParts(roomEnergyLevel);
      case"ROLE_DISMANTLER": return CreepManager.getDismantlerBodyParts(roomEnergyLevel);
      default: throw new Error(`${role} is not a valid creep role.`);
    }
  }

  static spawnMissingCreeps(roomName: string) {
    var energyLevel = utils.getRoomEnergyLevel(roomName);
    CreepManager.spawnMissingMiners(roomName, energyLevel);
    CreepManager.spawnMissingWorkers(roomName, energyLevel);
    CreepManager.spawnMissingUpgraders(roomName, energyLevel);
    CreepManager.spawnMissingCarriers(roomName, energyLevel);
    CreepManager.spawnMissingScouts(roomName, energyLevel);
    CreepManager.spawnMissingRemoteUpgraders(roomName, energyLevel);
    CreepManager.spawnMissingDismantlers(roomName, energyLevel);
    //CreepManager.spawnMissingDefenders(roomName, energyLevel);
  }


  static trySpawnCreep(spawn: StructureSpawn, role: CreepRole, energyLevel: number) {

    //console.log("trying to spawn a " + role + " for " + spawn.room.name)
    var bodyParts = CreepManager.GetCreepParts(role, energyLevel);
    return this.spawnCreep(spawn, bodyParts, role) == OK

  }
  private static getUpgraderBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [WORK, MOVE, MOVE, CARRY];
      case 2: return [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY]
      case 3: return [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
      case 4: return [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
      case 5: return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      default: return [WORK, MOVE, MOVE, CARRY];
    }
  }
  static getDismantlerBodyParts(energyLevel: number): BodyPartConstant[] {
    switch (energyLevel) {
      case 1: return [WORK, MOVE, MOVE, CARRY];
      case 2: return [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY]
      case 3: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
      case 4: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
      case 5: return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
      default: return [WORK, MOVE, MOVE, CARRY];
    }
  }
  private static getDefenderBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [WORK, MOVE, MOVE, CARRY];
      case 2: return [ATTACK, ATTACK, MOVE, MOVE]
      case 3: return [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
      case 4: return [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
      default: return [WORK, MOVE, MOVE, CARRY];
    }
  }
  private static getRemoteUpgraderBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [WORK, MOVE, MOVE, CARRY];
      case 2: return [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY]
      case 3: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
      case 4: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      default: return [WORK, MOVE, MOVE, CARRY];
    }
  }
  private static getWorkerBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [WORK, MOVE, MOVE, CARRY];
      case 2: return [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY]
      case 3: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
      case 4: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
      case 5: return [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]
      default: return [WORK, MOVE, MOVE, CARRY];
    }
  }
  private static getCarrierBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [MOVE, MOVE, CARRY, CARRY];
      case 2: return [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
      case 3: return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      case 4: return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      case 5: return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      default: return [WORK, MOVE, MOVE, CARRY];
    }
  }
  private static getMinerBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [WORK, WORK, MOVE, MOVE];
      case 2: return [WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
      case 3: return [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY]
      case 4: return [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY]
      case 5: return [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY]
      default: return [WORK, WORK, MOVE, MOVE];
    }
  }
  private static getScoutBodyParts(energyLevel: number): BodyPartConstant[] {

    switch (energyLevel) {
      case 1: return [MOVE, MOVE, MOVE];
      case 2: return [MOVE, MOVE, MOVE ]
      case 3: return [CLAIM, MOVE,]
      case 4: return [CLAIM, MOVE,]
      case 5: return [MOVE, CLAIM, MOVE, CLAIM ]
      default: return [MOVE, MOVE];
    }
  }
  static spawnMissingRemoteUpgraders(roomName: string, energyLevel: number) {
    const miners = utils.creepCount(roomName,"ROLE_MINER");
    const workers = utils.creepCount(roomName,"ROLE_WORKER");
    const carriers = utils.creepCount(roomName,"ROLE_CARRIER");
    const upgraders = utils.creepCount(roomName,"ROLE_UPGRADER");
    const roomMem = Game.rooms[roomName].memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];
    const currentRUCount = utils.creepCountAllRooms("ROLE_REMOTE_UPGRADER");
    if (miners < settings.minersPerSource * 2
      || workers < settings.maxWorkerCount
      || carriers < settings.maxCarrierCount) return;

    var flags = _.filter(Game.flags, f => f.color == COLOR_BLUE && f.secondaryColor == COLOR_BLUE);
    if (flags.length == 0) return;
    const spawns = utils.findSpawns(roomName);
    let remoteUpgradersNeeded: number = 3 - currentRUCount;
    let spawned: number = 0;
    for (var i in spawns) {

      if (spawned < remoteUpgradersNeeded) {
        var spawn = spawns[i] as StructureSpawn;
        
        if (spawn.spawning) continue;

        CreepManager.trySpawnCreep(spawn,"ROLE_REMOTE_UPGRADER", energyLevel);
        if (spawn.spawning) spawned++;
      }
      else break;
    }
  }
  static spawnMissingDefenders(roomName: string, energyLevel: number) {
    const currentDefenderCount = utils.creepCountAllRooms("ROLE_DEFENDER");
    const spawns = utils.findSpawns(roomName);
    let defendersNeeded: number = 3 - currentDefenderCount;
    let spawned: number = 0;
    for (var i in spawns) {

      if (spawned < defendersNeeded) {
        var spawn = spawns[i] as StructureSpawn;
        if (spawn.spawning) continue;

        CreepManager.trySpawnCreep(spawn,"ROLE_DEFENDER", energyLevel);
        if (spawn.spawning) spawned++;
      }
      else break;
    }
   
  }
  static spawnMissingScouts(roomName: string, energyLevel: number): void {
    const miners = utils.creepCount(roomName,"ROLE_MINER");
    const workers = utils.creepCount(roomName,"ROLE_WORKER");
    const upgraders = utils.creepCount(roomName,"ROLE_UPGRADER");
    const carriers = utils.creepCount(roomName,"ROLE_CARRIER");
    const roomMem = Game.rooms[roomName].memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];

    if (miners < settings.minimumMinerCount
      || carriers < settings.maxCarrierCount
      || upgraders < settings.maxUpgraderCount) {
      return;
    }

    var currentPending = CreepTaskQueue.count(roomName, "Scout", "", "PENDING");
    var currentlySpawning = _.filter(utils.findSpawns(roomName, false), s => {
      var spawn = s as StructureSpawn;
      return spawn.spawning != null && utils.getRole(spawn.spawning.name) == "ROLE_SCOUT";
    }).length;

    var scoutsNeeded = currentPending - currentlySpawning;
    if (scoutsNeeded < 1) return;
    var availableSpawns = utils.findSpawns(roomName, true);

    //var taskName = new ScoutRequest("test", "temp", false).name;
    let scoutsSpawned: number = 0;
    for (var i in availableSpawns) {
      var spawn = availableSpawns[i] as StructureSpawn;
      if (scoutsSpawned < scoutsNeeded) {
        if (CreepManager.trySpawnCreep(spawn, "ROLE_SCOUT", energyLevel)) scoutsSpawned++;
      }
      else break;
    }
    
  }

  private static spawnMissingDismantlers(roomName: string, energyLevel: number) {
    const miners = utils.creepCount(roomName, "ROLE_MINER");
    const carriers = utils.creepCount(roomName, "ROLE_CARRIER");
    const upgraders = utils.creepCount(roomName, "ROLE_UPGRADER");
    const room = Game.rooms[roomName]
    const roomMem = room.memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];
    const currentCount = utils.creepCount(roomName, "ROLE_WORKER");
    if (miners < settings.minimumMinerCount - 1 && currentCount > 0) {
      return;
    }
    if (carriers < settings.minimumCarrierCount || upgraders < settings.maxUpgraderCount) return;

    var flags = _.filter(Game.flags, f => f.pos.roomName == roomName && f.color == COLOR_YELLOW && f.secondaryColor == COLOR_YELLOW);
    if (flags.length == 0) return;
    CreepManager.spawnCreeps(roomName, "ROLE_DISMANTLER", 1, energyLevel);

  }

  private static spawnMissingWorkers(roomName: string, energyLevel: number) {
    const miners = utils.creepCount(roomName,"ROLE_MINER");
    const carriers = utils.creepCount(roomName,"ROLE_CARRIER");
    const upgraders = utils.creepCount(roomName,"ROLE_UPGRADER");
    const room = Game.rooms[roomName]
    const roomMem = room.memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];
    const currentCount = utils.creepCount(roomName,"ROLE_WORKER");
    if (miners < settings.minimumMinerCount - 1 && currentCount > 0) {
      return;
    }
    if (carriers < settings.minimumCarrierCount || upgraders < settings.maxUpgraderCount) return;

    if (room.find(FIND_CONSTRUCTION_SITES).length == 0) return;
    CreepManager.spawnCreeps(roomName,"ROLE_WORKER", settings.maxWorkerCount, energyLevel);
    
  }

  private static spawnMissingCarriers(roomName: string, energyLevel: number) {
    const miners = utils.creepCount(roomName,"ROLE_MINER");
    const workers = utils.creepCount(roomName,"ROLE_WORKER");

    const room = Game.rooms[roomName];
    const roomMem = room.memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];
    const currentCarrierCount = utils.creepCount(roomName,"ROLE_CARRIER");
    if (miners < settings.minimumMinerCount - 1 && workers < settings.minimumWorkerCount && currentCarrierCount > 0) {
      return;
    }
    CreepManager.spawnCreeps(roomName,"ROLE_CARRIER", settings.maxCarrierCount, energyLevel);
  }
  private static spawnMissingUpgraders(roomName: string, energyLevel: number) {
    const roomMem = Game.rooms[roomName].memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];
    const workers = utils.creepCount(roomName,"ROLE_WORKER");
    const carriers = utils.creepCount(roomName,"ROLE_CARRIER");
    const miners = utils.creepCount(roomName,"ROLE_MINER");
    if (miners < settings.minimumMinerCount) return;
    if (carriers < settings.minimumCarrierCount) return;
    CreepManager.spawnCreeps(roomName,"ROLE_UPGRADER", settings.maxUpgraderCount, energyLevel);
  }
  private static spawnMissingMiners(roomName: string, energyLevel: number) {
    const roomMem = Game.rooms[roomName].memory as RoomMemory;
    const settings = roomMem.settingsMap[energyLevel];
    const spawns = utils.findSpawns(roomName);
    const currentMinerCount = utils.creepCount(roomName,"ROLE_MINER");

    const room = Game.rooms[roomName]
    const sources = room.find(FIND_SOURCES);


    const minerCount = sources.length * settings.minersPerSource;
    CreepManager.spawnCreeps(roomName,"ROLE_MINER", minerCount, energyLevel);
   
  }

  private static spawnCreeps(roomName: string, role: CreepRole, max: number, energyLevel: number) {
    const spawns = utils.findSpawns(roomName, false);
    const currentCount = utils.creepCount(roomName, role);
    var currentlySpawning = _.filter(spawns, s => {
      var spawn = s as StructureSpawn;
      return spawn.spawning != null && utils.getRole(spawn.spawning.name) == role;
    }).length;

    var availableSpawns = utils.findSpawns(roomName, true);

    let totalNeeded: number = max - (currentCount + currentlySpawning);
    if (totalNeeded < 1) return;

    let creepsSpawned: number = 0;

    for (var i in availableSpawns) {
      var spawn = availableSpawns[i] as StructureSpawn;
      if (creepsSpawned < totalNeeded) {
        if (CreepManager.trySpawnCreep(spawn, role, energyLevel)) creepsSpawned++;
      }
      else break;
    }
  }

  private static spawnCreep(spawn: StructureSpawn, bodyParts: BodyPartConstant[], role: CreepRole): number {
    //console.log("trying to spawn " + getRoleString(role))
    let uuid: number = Memory.uuid;
    let creepName: string = spawn.room.name + "-" + role + "-" + (uuid + 1);
    let status: number | string = spawn.spawnCreep(bodyParts, creepName, { dryRun: true });
    status = _.isString(status) ? OK : status;

    while (status == -3) {
      uuid++;
      creepName = spawn.room.name + "-" + role + "-" + (uuid + 1);
      status = spawn.spawnCreep(bodyParts, creepName, { dryRun: true });
      status = _.isString(status) ? OK : status;
    }

    if (status === OK && spawn.spawning == null) {
      Memory.uuid = uuid + 1;
      const creepName: string = spawn.room.name + "-" + role + "-" + uuid;

      const memory: CreepMemory =
      {
        spawnID: spawn.id,
        homeRoom: spawn.room.name,
        idle: true,
        currentTask: "",
        alive: true,
        role: role,
        _trav: 0,
        _travel: 0
        
      };


      status = spawn.spawnCreep(bodyParts, creepName, { memory: memory });

      return _.isString(status) ? OK : status;
    }
    else {
      
      return status;
    }
  }
}