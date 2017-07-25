import {Help} from "../../common/Help";

export class SonicConstants {
    public acc: number;
    public air: number;
    public dec: number;
    public frc: number;
    public grv: number;
    public jmp: number;
    public rdec: number;
    public rfrc: number;
    public slp: number;
    public slpRollingDown: number;
    public slpRollingUp: number;
    public topSpeed: number;

    public static Sonic(): SonicConstants {

        let sc = new SonicConstants();

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
}