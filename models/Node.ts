
export type ID = string;

export type Node = {
  id : ID;
  label: string;

  parent:   ID|null;
  children: ID[];
}
