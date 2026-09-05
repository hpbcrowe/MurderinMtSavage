export class ResearchNoteCreate {
  constructor(
    public researchNoteId: number,
    public title: string,
    public content: string,
    public ancestorProfileId?: number,
    public status?: string,
    public confidenceLevel?: string,
    public tags?: string
  ) {}
}