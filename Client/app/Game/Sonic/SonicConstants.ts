import {Help} from "../../Common/Help";

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
        let sc = Help.merge(new SonicConstants(), {
            acc: 0.046875,
            dec: 0.5,
            slp: 0.125,
            frc: 0.046875,
            rdec: 0.125,
            rfrc: 0.0234375,
            slpRollingUp: 0.078125,
            slpRollingDown: 0.3125,
            jmp: -6.5,
            grv: 0.21875,
            air: 0.09375,
            topSpeed: 6
        });
        return sc;
    }
}