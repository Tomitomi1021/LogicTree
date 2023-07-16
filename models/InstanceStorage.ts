import { Node,ID } from "./Node.ts"
import { IInstanceAccessor } from "./NodeModel.ts";
import { v4 as uuidv4 } from "uuid";

class InstanceStorage implements IInstanceAccessor{
  private _storage : { [id: ID]: Node } = {};

  new(node: Node): ID{
    const id = uuidv4();
    const node = {...node};

    if(id in this._storage){
      throw Error("UUID is conflicted. You are lucky guy!!!");
    }else{
      this._storage[id] = node;
      return id;
    }
  }

  set(id:ID,node: Node){
    const node = {...node};

    if(id in this._storage){
      this._storage[id] = node;
    }else{
      throw Error(`No such node (ID=${nodeId})`);
    }
  }

  get(id:ID): Node{
    if(id in this._storage){
      const nodeFromStorage = this._storage[id];
      const node = {...nodeFromStorage};
      return node;
    }else{
      throw Error(`No such node (ID=${nodeId})`);
    }
  }

  del(id:ID){
    if(id in this._storage){
      delete this._storage[id];
    }else{
      throw Error(`No such node (ID=${nodeId})`);
    }
  }
};
