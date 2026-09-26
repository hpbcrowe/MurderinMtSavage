export class AncestorRelativeSummary {
  constructor(
    public ancestorProfileId: number,
    public firstName: string,
    public middleName?: string,
    public lastName?: string,
    public gender?: string,
    public relationshipLabel?: string
  ) {}

  get displayName(): string {
    const middleNamePart = this.middleName ? ` ${this.middleName}` : '';
    const lastNamePart = this.lastName ? ` ${this.lastName}` : '';
    return `${this.firstName}${middleNamePart}${lastNamePart}`.trim();
  }
}
