export class Bio {
    constructor(
      public username: string,
      public profilePicture: string,
      public isHireable: boolean,
      public languagesSpoken: string[],
      public description: string,
      public codingLanguages: string[],
      public isPremium: boolean,
      public isStaff: boolean,
      public staffRank: int,
      public badges: string[]

    ) {}
  }