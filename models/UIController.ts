import { ID } from "./Node.ts";
import { NodeModel, IInstanceAccessor } from "./NodeModel.ts";

/**
 * @brief UIにおいて，ユーザーが行う操作を定義する．
 */
class UIController extends NodeModel{
  private _cursor:       ID;      //今，どのノードが注目されているかを示す
  private _defaultLabel: string;  //ノードを追加する際のデフォルトのラベル名
  private _editMode:     bool;    //編集モードか否か

  constructor(accessor: IInstanceAccessor,rootNode: ID,defaultLabel: string){
    super(accessor);

    this._cursor       = rootNode;
    this._defaultLabel = defaultLabel;
    this._editMode     = false;
  }

  getNodeInfo(nodeId:ID){
    const label = this.getLabel(nodeId);
    const isOnCursor = (this._cursor===nodeId);
    const isEditMode = (isOnCursor===true)?this._editMode:false;
    return {
      label:      label,
      isOnCursor: isOnCursor,
      isEditMode: isEditMode
    };
  }

  activateEditMode(){
    this._editMode = true;
  }

  cursorMoveTo(to: ID){
    this._cursor = to;
    this._editMode = false;
  }

  editLabel(newLabel: string){
    if(this._editMode === true){
      this.setLabel(this._cursor,newLabel);
    }else{
      throw Error("editLabel called at non-editMode");
    }
  }

  cursorMoveToParent(){
    const parentNode = this.getParent(this._cursor);
    if(parentNode !== null){
      this.cursorMoveTo(parentNode);
    }
  }

  cursorMoveToChild(){
    const children = this.getChildren(this._cursor);
    if(children.length > 0){
      this.cursorMoveTo(children[0]);
    }
  }

  cursorMoveToPrevSibling(){
    const prevSibling = this.getPrevSibling(this._cursor);
    if(prevSibling!==null){
      this.cursorMoveTo(prevSibling);
    }
  }

  cursorMoveToNextSibling(){
    const nextSibling = this.getNextSibling(this._cursor);
    if(nextSibling!==null){
      this.cursorMoveTo(nextSibling);
    }
  }

  addChildNode(){
    const newNode = this.addChild(this._cursor,this._defaultLabel);
    this.cursorMoveTo(newNode);
  }

  addNextSiblingNode(){
    const newNode = this.addNextSibling(this._cursor,this._defaultLabel);
    this.cursorMoveTo(newNode);
  }

  addPrevSiblingNode(){
    const newNode = this.addPrevSibling(this._cursor,this._defaultLabel);
    this.cursorMoveTo(newNode);
  }

  deleteThisNode(){
    const children = this.getChildren(this._cursor).length;
    if(children.length===0){
      const parentNode = this.getParent(this._cursor);
      const nextSibling = this.getNextSibling(this._cursor);
      const prevSibling = this.getPrevSibling(this._cursor);

      this.delNode(this._cursor);

      if(nextSibling !== null){
        this.cursorMoveTo(nextSibling);
      }else if(prevSibling !== null){
        this.cursorMoveTo(prevSibling);
      }else if(parentNode !== null){
        this.cursorMoveTo(parentNode);
      }else{
        throw Error("削除後の移動先がありません．");
      }
    }
  }

  deleteThisNodeForce(){
    const children = this._model.getChildren(this._cursor).length;
    if(children.length===0){
      const parentNode = this._model.getParent(this._cursor);
      const nextSibling = this._model.getNextSibling(this._cursor);
      const prevSibling = this._model.getPrevSibling(this._cursor);

      this._model.delNodeAll(this._cursor);

      if(nextSibling !== null){
        this.cursorMoveTo(nextSibling);
      }else if(prevSibling !== null){
        this.cursorMoveTo(prevSibling);
      }else if(parentNode !== null){
        this.cursorMoveTo(parentNode);
      }else{
        throw Error("削除後の移動先がありません．");
      }
    }
  }
};
