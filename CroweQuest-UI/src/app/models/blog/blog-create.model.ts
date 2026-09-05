export class BlogCreate {

    constructor(
        public blogId: number,
        public title: string,
        public content: string,
        public photoId?: number,
        public ancestorProfileId?: number,
        public sourceId?: number,
        public ancestorName?: string,
        public recordType?: string,
        public location?: string,
        public familyBranch?: string,
        public tags?: string,
        public confidenceLevel?: string,
        public researchStatus?: string
    ) {}

}