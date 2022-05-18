export interface Module {
  moduleId: string;
  name: string;
  description?: string;
  resourceKey: string;
  publicModule?: boolean;
  link: string;
  status: string;
  className: string;
  order: number;
  modules?: Module[];
}
