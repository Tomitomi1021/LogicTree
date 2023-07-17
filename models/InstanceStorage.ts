import { Node,ID } from '~/models/Node.ts'
import { IInstanceAccessor,NodeParams } from '~/models/NodeModel.ts';
import { v4 as uuidv4 } from 'uuid';

export class InstanceStorage implements IInstanceAccessor{
  private _storage : { [id: ID]: Node } = {};

  new(params: NodeParams): ID{
    const id = uuidv4();

    if(id in this._storage){
      throw Error("UUID is conflicted. You are lucky guy!!!");
    }else{
      const newNode : Node = {
        id: id,
        label: "",
        parent: null,
        children: []
      };

      Object.assign(newNode,params);
      this._storage[id] = newNode;

      return id;
    }
  }

  set(id:ID,params: NodeParams){
    if(id in this._storage){
      Object.assign(this._storage[id],params);
    }else{
      throw Error(`No such node (ID=${id})`);
    }
  }

  get(id:ID): Node{
    if(id in this._storage){
      const nodeFromStorage = this._storage[id];
      const node = {...nodeFromStorage};
      return node;
    }else{
      throw Error(`No such node (ID=${id})`);
    }
  }

  del(id:ID){
    if(id in this._storage){
      delete this._storage[id];
    }else{
      throw Error(`No such node (ID=${id})`);
    }
  }

  getInstance(id:ID): NodeAccess{
    if(id in this._storage){
      return this._storage[id];
    }else{
      throw Error(`No such node (ID=${id})`);
    }
  }
};
