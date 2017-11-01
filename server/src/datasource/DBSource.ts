export interface DBSource {
  put(resource: any, resourceID?: string): Promise<any>;

  get(resourceID: string): Promise<any>;

  all(): Promise<any>;

  update(resourceID: string, resource: any): Promise<any>;

  delete(resourceID: string): Promise<any>;
}