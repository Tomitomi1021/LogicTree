
import { Node, ID } from '~/models/Node.ts';

//Nodeのインスタンスに何かしらの値を代入する時に使用する．
export type NodeParams = Partial<Omit<Node,id>>;

//Nodeのインスタンスを直接操作する時に用いる．
export type NodeAccess = ReadOnly<Pick<Node,id>>|Omit<Node,id>;

export interface IInstanceAccessor{
  new(params: NodeParams): id;
  set(id:ID,params: NodeParams);
  get(id:ID): Node;
  del(id:ID);
};

/**
 * @brief Nodeに対するプリミティブな操作を定義する．
 * this.IInstanceAccessorを直接使用する操作はここで定義する．
 */
class NodeModelBase{
  private _acc: IInstanceAccessor;

  constructor(accessor: IInstanceAccessor){
    this._acc = accessor;
  }

  isRoot(nodeId:ID): bool{
    const node = this._acc.get(nodeId);

    return node.parent === null;
  }
  
  getLabel(nodeId:ID): string{
    const node = this._acc.get(nodeId);

    return node.label;
  }

  setLabel(nodeId:ID, newLabel:string){
    const node = this._acc.get(nodeId);

    node.label = newLabel;
    this._acc.set(nodeId,node);
  }

  getChildren(nodeId:ID): ID[]{
    const node = this._acc.get(nodeId);

    return node.children;
  }

  getParent(nodeId:ID): ID | null{
    const node = this._acc.get(nodeId);

    return node.parent;
  }

  addChild(nodeId:ID, label: string, index: number | undefined): ID{
    const node = this._acc.get(nodeId);

    const params = {
      label: label,
      parent: nodeId
    };

    const newNodeId = this._acc.new(params);

    if(index === undefined){
      node.children.push(newNodeId);
      this._acc.set(nodeId,node);
      return newNodeId;
    }else if(0 <= index && index <= node.children.length){
      node.children.splice(index,0,newNodeId);
      this._acc.set(nodeId,node);
      return newNodeId;
    }else{
      throw Error(`Index is invalid (index=${index})`);
    }
  }

  delNode(nodeId:ID){
    const node = this._acc.get(nodeId);
    if(node.parent === null)throw Error(`Root cannot be deleted.`);

    const parentNode = this._acc.get(node.parent);

    parentNode.children 
      = parentNode.children.filter((id)=>{
        return id !== nodeId;
      });
    this._acc.set(node.parent,parentNode);

    this._acc.del(nodeId);
  }
}


/**
 * @brief NodeModelBaseを使用した操作を定義する．
 * IInstanceAccessorを直接使わない操作はこちらで定義する．
 */
export class NodeModel extends NodeModelBase{
  constructor(accessor: IInstanceAccessor){
    super(accessor);
  }

  getSiblings(nodeId:ID): ID[]{
    return this.getChildren(this.getParent(nodeId));
  }

  addSibling(nodeId:ID, label: string, index: number | undefined): ID{
    return this.addChild(this.getParent(nodeId), label, index);
  }

  getNextSibling(nodeId:ID): ID|null{
    const siblings = this.getSiblings(nodeId);
    const index = siblings.indexOf(nodeId);
    if(index+1 < siblings.length){
      return siblings[index+1];
    }else{
      return null;
    }
  }

  getPrevSibling(nodeId:ID): ID|null{
    const siblings = this.getSiblings(nodeId);
    const index = siblings.indexOf(nodeId);
    if(index-1 >= 0){
      return siblings[index-1];
    }else{
      return null;
    }
  }

  addNextSibling(nodeId:ID,label:string): ID{
    const siblings = this.getSiblings(nodeId);
    const index = siblings.indexOf(nodeId);
    if(index+1 <= siblings.length){
      return this.addSibling(nodeId, label, index+1);
    }else{
      throw Error(`Index is invalid (index=${index})`);
    }
  }

  addPrevSibling(nodeId:ID,label:string): ID{
    const siblings = this.getSiblings(nodeId);
    const index = siblings.indexOf(nodeId);
    if(index >= 0){
      return this.addSibling(nodeId, label, index);
    }else{
      throw Error(`Index is invalid (index=${index})`);
    }
  }

  delNodeAll(nodeId:ID){
    const children = this.getChildren(nodeId);
    if(children.length === 0){
      this.delNode(nodeId);
    }else{
      children.forEach((child)=>{
        this.delNodeAll(child);
      });
      this.delNode(nodeId);
    }
  }

};



