export class SourceCreate {
  constructor(
    public sourceId: number,
    public title: string,
    public sourceType?: string,
    public citation?: string,
    public description?: string,
    public documentDate?: string,
    public location?: string,
    public repository?: string,
    public attachedFileUrl?: string,
    public fileId?: number
  ) {}
}