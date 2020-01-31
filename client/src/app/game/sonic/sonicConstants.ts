export class SonicConstants {
  acc: number;
  air: number;
  dec: number;
  frc: number;
  grv: number;
  jmp: number;
  rdec: number;
  rfrc: number;
  slp: number;
  slpRollingDown: number;
  slpRollingUp: number;
  topSpeed: number;

  static sonic(): SonicConstants {
    const sc = new SonicConstants();

    sc.acc = 0.046875;
    sc.dec = 0.5;
    sc.slp = 0.125;
    sc.frc = 0.046875;
    sc.rdec = 0.125;
    sc.rfrc = 0.0234375;
    sc.slpRollingUp = 0.078125;
    sc.slpRollingDown = 0.3125;
    sc.jmp = -6.5;
    sc.grv = 0.21875;
    sc.air = 0.09375;
    sc.topSpeed = 6;

    return sc;
  }
  static superSonic(): SonicConstants {
    const sc = new SonicConstants();

    sc.acc = 0.1875;
    sc.dec = 1;
    sc.slp = 0.125;
    sc.frc = 0.046875;
    sc.rdec = 0.125;
    sc.rfrc = 0.09375;
    sc.slpRollingUp = 0.078125;
    sc.slpRollingDown = 0.3125;
    sc.jmp = -8;
    sc.grv = 0.21875;
    sc.air = 0.375;
    sc.topSpeed = 10;

    return sc;
  }
}
