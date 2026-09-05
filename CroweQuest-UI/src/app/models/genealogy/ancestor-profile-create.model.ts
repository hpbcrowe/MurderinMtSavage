export class AncestorProfileCreate {
  constructor(
    public ancestorProfileId: number,
    public firstName: string,
    public middleName?: string,
    public lastName?: string,
    public suffix?: string,
    public gender?: string,
    public birthDate?: string,
    public birthLocation?: string,
    public deathDate?: string,
    public deathLocation?: string,
    public biography?: string,
    public researchStatus?: string,
    public familyBranch?: string,
    public tags?: string,
    public confidenceLevel?: string,
    public profilePhotoId?: number
  ) {}
}