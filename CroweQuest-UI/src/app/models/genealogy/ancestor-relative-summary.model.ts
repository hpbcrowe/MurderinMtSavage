export class AncestorRelativeSummary {
  constructor(
    // The unique identifier for the ancestor profile
    public ancestorProfileId: number,
    // The first name of the ancestor
    public firstName: string,
    // The middle name of the ancestor (optional)
    public middleName?: string,
    // The last name of the ancestor (optional)
    public lastName?: string,
    // The gender of the ancestor (optional)
    public gender?: string,
    // The relationship label of the ancestor (optional)
    public relationshipLabel?: string
  ) {}

  get displayName(): string {
    const middleNamePart = this.middleName ? ` ${this.middleName}` : '';
    const lastNamePart = this.lastName ? ` ${this.lastName}` : '';
    return `${this.firstName}${middleNamePart}${lastNamePart}`.trim();
  }
}
