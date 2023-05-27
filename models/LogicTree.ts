export class Node{
  label: string;
  children: Node[];

  constructor(label: string) {
    this.label = label;
    this.children = [];
  }

  newChild(index:Number, label: string){
    let childNode = new Node(label);
    this.children.splice(index,0,childNode);
  }

  addChild(node: Node): void {
    this.children.push(node);
  }

  removeChild(node: Node): void {
    const index = this.children.indexOf(node);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }
}

export class LogicTree {
  private root: Node;

  constructor(root: Node) {
    this.root = root;
  }

  getRoot(): Node{
    return this.root;
  }

  setRoot(node: Node): void {
    this.root = node;
  }

  addNode(parentNode: Node, newNode: Node): void {
    parentNode.addChild(newNode);
  }

  removeNode(parentNode: Node, nodeToRemove: Node): void {
    parentNode.removeChild(nodeToRemove);
  }
}

