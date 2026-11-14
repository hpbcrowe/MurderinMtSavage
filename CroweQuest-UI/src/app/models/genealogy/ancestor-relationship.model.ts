export class AncestorRelationship {
  constructor(
    // The unique identifier for the ancestor relationship
    public ancestorRelationshipId: number,
    // The unique identifier for the ancestor profile
    public ancestorProfileId: number,
    // The unique identifier for the related ancestor profile
    public relatedAncestorProfileId: number,
    // The type of relationship between the ancestors
    public relationshipType: string,
    // The date the relationship was created
    public createdDate?: Date
  ) {}
}