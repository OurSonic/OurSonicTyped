export class LevelService {
  private static storedLevels: SonicLevelData[];

  constructor() {}

  private static getLevelsUrl = 'https://api.oursonic.org/levels';
  private static getLevelUrl = 'https://api.oursonic.org/level';

  static async getLevels(): Promise<SonicLevelData[]> {
    return [];
    if (LevelService.storedLevels) {
      return LevelService.storedLevels;
    } else {
      const result = await fetch(this.getLevelsUrl);
      LevelService.storedLevels = await result.json();
      return LevelService.storedLevels;
    }
  }

  static async getLevel(level: string): Promise<string> {
    return null;
    const result = await fetch(this.getLevelUrl + '?level=' + level);
    return await result.json();
  }
}

export class SonicLevelData {
  name: string;
}
