
import { Node, ID } from "./Node.ts";

interface IInstanceAccessor{
  new(node: Node): id | undefined;
  set(id:ID,node: Node);
  get(id:ID): Node | undefined;
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
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);

    return node.parent === null;
  }
  
  getLabel(nodeId:ID): string{
    const node = this._acc.get(nodeId);
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);

    return node.label;
  }

  setLabel(nodeId:ID, newLabel:string){
    const node = this._acc.get(nodeId);
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);

    node.label = newLabel;
    this._acc.set(nodeId,node);
  }

  getChildren(nodeId:ID): ID[]{
    const node = this._acc.get(nodeId);
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);

    return node.children;
  }

  getParent(nodeId:ID): ID | null{
    const node = this._acc.get(nodeId);
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);

    return node.parent;
  }

  addChild(nodeId:ID, label: string, index: number | undefined): ID{
    const node = this._acc.get(nodeId);
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);

    let params: Node;
    params.label = label;
    params.parent = nodeId;
    params.children = [];

    const newNodeId = this._acc.new(params);
    if(newNodeId === undefined)throw Error(`Failed to create a node`);

    if(index === undefined){
      node.children.push(newNodeId);
      this._acc.set(nodeId,node);
    }else if(0 <= index && index <= parentNode.children.length){
      node.children.splice(index,0,newNodeId);
      this._acc.set(nodeId,node);
    }else{
      throw Error(`Index is invalid (index=${index})`);
    }
  }

  delNode(nodeId:ID){
    const node = this._acc.get(nodeId);
    if(node === undefined)throw Error(`No such node (ID=${nodeId})`);
    if(node.parent === null)throw Error(`Root cannot be deleted.`);

    const parentNode = this._acc.get(node.parent);
    if(parentNode === undefined)throw Error(`No such node (ID=${parentNode})`);

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
class NodeModel extends NodeModelBase{
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
        delNodeAll(child);
      });
      this.delNode(nodeId);
    }
  }

};



