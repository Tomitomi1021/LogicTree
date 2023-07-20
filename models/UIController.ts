import { ID } from '~/models/Node.ts';
import { NodeModel, IInstanceAccessor } from '~/models/NodeModel.ts';

export interface IUserInterface{
  setCursor(cursor:ID);
  getCursor():ID;
};

/**
 * @brief UIにおいて，ユーザーが行う操作を定義する．
 */
export class UIController extends NodeModel{
  private _defaultLabel: string;  //ノードを追加する際のデフォルトのラベル名
  private _ui: IUserInterface;    

  constructor(
    accessor: IInstanceAccessor,
    ui: IUserInterface,
    defaultLabel: string){
    super(accessor);

    this._defaultLabel = defaultLabel;
    this._ui = ui;
  }

  cursorMoveToParent(){
    const parentNode = this.getParent(this._ui.getCursor());
    if(parentNode !== null){
      this._ui.setCursor(parentNode);
    }
  }

  cursorMoveToChild(){
    const children = this.getChildren(this._ui.getCursor());
    if(children.length > 0){
      this._ui.setCursor(children[0]);
    }
  }

  cursorMoveToPrevSibling(){
    const prevSibling = this.getPrevSibling(this._ui.getCursor());
    if(prevSibling!==null){
      this._ui.setCursor(prevSibling);
    }
  }

  cursorMoveToNextSibling(){
    const nextSibling = this.getNextSibling(this._ui.getCursor());
    if(nextSibling!==null){
      this._ui.setCursor(nextSibling);
    }
  }

  addChildNode(){
    const newNode = this.addChild(this._ui.getCursor(),this._defaultLabel);
    this._ui.setCursor(newNode);
  }

  addNextSiblingNode(){
    const newNode = this.addNextSibling(this._ui.getCursor(),this._defaultLabel);
    this._ui.setCursor(newNode);
  }

  addPrevSiblingNode(){
    const newNode = this.addPrevSibling(this._ui.getCursor(),this._defaultLabel);
    this._ui.setCursor(newNode);
  }

  deleteThisNode(){
    const children_length = this.getChildren(this._ui.getCursor()).length;
    if(children_length===0){
      const parentNode = this.getParent(this._ui.getCursor());
      const nextSibling = this.getNextSibling(this._ui.getCursor());
      const prevSibling = this.getPrevSibling(this._ui.getCursor());

      this.delNode(this._ui.getCursor());

      if(nextSibling !== null){
        this._ui.setCursor(nextSibling);
      }else if(prevSibling !== null){
        this._ui.setCursor(prevSibling);
      }else if(parentNode !== null){
        this._ui.setCursor(parentNode);
      }else{
        throw Error("削除後の移動先がありません．");
      }
    }
  }

  deleteThisNodeForce(){
    const children = this.getChildren(this._ui.getCursor()).length;

    const parentNode = this.getParent(this._ui.getCursor());
    const nextSibling = this.getNextSibling(this._ui.getCursor());
    const prevSibling = this.getPrevSibling(this._ui.getCursor());

    this.delNodeAll(this._ui.getCursor());

    if(nextSibling !== null){
      this._ui.setCursor(nextSibling);
    }else if(prevSibling !== null){
      this._ui.setCursor(prevSibling);
    }else if(parentNode !== null){
      this._ui.setCursor(parentNode);
    }else{
      throw Error("削除後の移動先がありません．");
    }
  }
};
