import { AncestorProfileCreate } from './ancestor-profile-create.model';
import { AncestorRelativeSummary } from './ancestor-relative-summary.model';

export class AncestorProfile extends AncestorProfileCreate {
  constructor(
    ancestorProfileId: number,
    firstName: string,
    middleName?: string,
    lastName?: string,
    suffix?: string,
    gender?: string,
    birthDate?: string,
    birthLocation?: string,
    deathDate?: string,
    deathLocation?: string,
    biography?: string,
    researchStatus?: string,
    familyBranch?: string,
    tags?: string,
    confidenceLevel?: string,
    profilePhotoId?: number,
    fatherAncestorProfileId?: number,
    motherAncestorProfileId?: number,
    siblingAncestorProfileIds: number[] = [],
    public father?: AncestorRelativeSummary,
    public mother?: AncestorRelativeSummary,
    public siblings: AncestorRelativeSummary[] = [],
    public children: AncestorRelativeSummary[] = [],
    public username?: string,
    public applicationUserId?: number,
    public publishDate?: Date,
    public updateDate?: Date
  ) {
    super(
      ancestorProfileId,
      firstName,
      middleName,
      lastName,
      suffix,
      gender,
      birthDate,
      birthLocation,
      deathDate,
      deathLocation,
      biography,
      researchStatus,
      familyBranch,
      tags,
      confidenceLevel,
      profilePhotoId,
      fatherAncestorProfileId,
      motherAncestorProfileId,
      siblingAncestorProfileIds
    );
  }
}