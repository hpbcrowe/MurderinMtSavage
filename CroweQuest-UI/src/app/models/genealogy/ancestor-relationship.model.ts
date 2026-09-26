export class AncestorRelationship {
  constructor(
    public ancestorRelationshipId: number,
    public ancestorProfileId: number,
    public relatedAncestorProfileId: number,
    public relationshipType: string,
    public createdDate?: Date
  ) {}
}