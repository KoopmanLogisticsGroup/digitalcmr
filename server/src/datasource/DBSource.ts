export interface DBSource {
  put(resource: any, resourceID?: string): Promise<any>;

  get(resourceID: string): Promise<any>;

  update(resource: any): Promise<any>;

  delete(resourceID: string): Promise<any>;
}