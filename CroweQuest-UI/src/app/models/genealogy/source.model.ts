import { SourceCreate } from './source-create.model';

export class Source extends SourceCreate {
  constructor(
    sourceId: number,
    title: string,
    sourceType?: string,
    citation?: string,
    description?: string,
    documentDate?: string,
    location?: string,
    repository?: string,
    attachedFileUrl?: string,
    fileId?: number,
    public username?: string,
    public applicationUserId?: number,
    public publishDate?: Date,
    public updateDate?: Date
  ) {
    super(
      sourceId,
      title,
      sourceType,
      citation,
      description,
      documentDate,
      location,
      repository,
      attachedFileUrl,
      fileId
    );
  }
}