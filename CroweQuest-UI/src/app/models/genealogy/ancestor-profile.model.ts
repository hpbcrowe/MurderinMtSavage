import { AncestorProfileCreate } from './ancestor-profile-create.model';

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
      profilePhotoId
    );
  }
}