import { ErrorMapper } from "utils/ErrorMapper";
import * as MemUtils from "utils/memory"
import * as utils from "utils/utils"
import { taskManager } from "taskManager";
import { CreepManager } from "CreepManager";


global.roomManager = new RoomManager();

function mainLoop() {
  MemUtils.InitializeGame();
  for (const roomName in Memory.rooms) {
    //const room: Room = Game.rooms[i];
    //const roomName = room.name;
    global.roomManager.Run(roomName);
    CreepManager.run(roomName);
    taskManager.run(roomName);
  }
  MemUtils.cleanupCreeps();
  global.help = () => console.log("Helps!")
}

export const loop = ErrorMapper.wrapLoop(mainLoop);

