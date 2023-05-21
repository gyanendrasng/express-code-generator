export interface Route {
  name: string;
}

export interface Schema {
  routes: Route[];
}

export interface Project {
  id: string;
  name: string;
  schema: Schema;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}
