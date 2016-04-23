import {Help} from "../../Common/Help";

export class SonicConstants {
    public Acc: number;
    public Air: number;
    public Dec: number;
    public Frc: number;
    public Grv: number;
    public Jmp: number;
    public Rdec: number;
    public Rfrc: number;
    public Slp: number;
    public SlpRollingDown: number;
    public SlpRollingUp: number;
    public TopSpeed: number;
    public static Sonic(): SonicConstants {
        let sc = Help.Merge(new SonicConstants(), {
            Acc: 0.046875,
            Dec: 0.5,
            Slp: 0.125,
            Frc: 0.046875,
            Rdec: 0.125,
            Rfrc: 0.0234375,
            SlpRollingUp: 0.078125,
            SlpRollingDown: 0.3125,
            Jmp: -6.5,
            Grv: 0.21875,
            Air: 0.09375,
            TopSpeed: 6
        });
        return sc;
    }
}