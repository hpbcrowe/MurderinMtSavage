import { ResearchNoteCreate } from './research-note-create.model';

export class ResearchNote extends ResearchNoteCreate {
  constructor(
    researchNoteId: number,
    title: string,
    content: string,
    ancestorProfileId?: number,
    status?: string,
    confidenceLevel?: string,
    tags?: string,
    public username?: string,
    public applicationUserId?: number,
    public publishDate?: Date,
    public updateDate?: Date
  ) {
    super(
      researchNoteId,
      title,
      content,
      ancestorProfileId,
      status,
      confidenceLevel,
      tags
    );
  }
}