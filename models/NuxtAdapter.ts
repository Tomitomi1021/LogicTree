import {Node, ID} from '~/models/Node.ts';
import {UIController,IUserInterface} from '~/models/UIController.ts';
import {InstanceStorage} from '~/models/InstanceStorage.ts';



export class NuxtAdapter implements IUserInterface{
  public instanceStorage:InstanceStorage;
  public rootNode: ID;
  public controller: UIController;
  public cursor: ID;
  public editMode: bool;

  constructor(){
    this.instanceStorage = new InstanceStorage();

    const params : Node = {
      label: "Root"
    };
    this.rootNode = this.instanceStorage.new(params);

    this.controller = new UIController(
      this.instanceStorage,
      this,
      "New Label");

    const child1 = this.controller.addChild(this.rootNode,"Child1");
    const child2 = this.controller.addChild(this.rootNode,"Child2");

    this.controller.addChild(child1,"Child11");
    this.controller.addChild(child1,"Child12");
    this.controller.addChild(child2,"Child21");
    this.controller.addChild(child2,"Child22");

    this.cursor = this.rootNode;
  }

  activateEditMode(){
    this.editMode = true;
  }

  deactivateEditMode(){
    this.editMode = false;
  }

  setCursor(cursor:ID){
    if(this.cursor !== cursor){
      this.deactivateEditMode();
    }
    this.cursor = cursor;
  }

  getCursor():ID{
    return this.cursor;
  }

  getChildren(id:ID):ID[]{
    return this.controller.getChildren(id);
  }
}

export class NuxtAdapterProvider{
  static instance : NuxtAdapter = undefined;
  static get() : NuxtAdapter {
    if(NuxtAdapterProvider.instance === undefined){
      NuxtAdapterProvider.instance = new NuxtAdapter();
    }

    return NuxtAdapterProvider.instance;
  }
};
