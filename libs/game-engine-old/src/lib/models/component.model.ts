export type ComponentId = string;

export interface Component {
  id: ComponentId;
  data: {
    [key: string]: any;
  };
}
