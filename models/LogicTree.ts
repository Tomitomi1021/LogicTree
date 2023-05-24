
interface Node {
  id: string;
  label: string;
  children: Node[];
  addChild(node: Node): void;
  removeChild(node: Node): void;
}

class LogicTree {
  private root: Node | null;

  constructor() {
    this.root = null;
  }

  getRoot(): Node | null {
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

