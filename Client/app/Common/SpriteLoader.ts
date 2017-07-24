export class SpriteLoader {
    private myCompleted: () => void;
    private myUpdate: (_: string) => void;
    private done: boolean = false;
    private stepIndex: number = 0;
    private steps: SpriteLoaderStep[] = new Array<SpriteLoaderStep>();
    private tickIndex: number = 0;
    constructor(completed: () => void, update: (_: string) => void) {
        this.myCompleted = completed;
        this.myUpdate = update;
    }
    public Tick(): boolean {
        if (this.stepIndex == this.steps.length) {
            if (!this.done) {
                this.done = true;
                this.myCompleted();
            }
            return true;
        }
        let stp = this.steps[this.stepIndex];
        if (!stp)
            return true;
        if ((this.tickIndex % stp.Iterations.length / 12 |0)== 0)
            this.myUpdate("Caching: " + stp.Title + " " + ((this.tickIndex / stp.Iterations.length) * 100) + "%");
        if (stp.Iterations.length > this.tickIndex) {
            stp.Method(stp.Iterations[this.tickIndex++],
                () => {
                    if (stp.OnFinish()) {
                        this.stepIndex++;
                        this.tickIndex = 0;
                    }
                });
        }
        return false;
    }
    public AddStep(title: string, method: (_: number, __: () => void) => void, onFinish: () => boolean, disable: boolean): number {
        if (disable)
            return -1;
        this.steps.push(new SpriteLoaderStep(title, method, onFinish));
        return this.steps.length - 1;
    }
    public addIterationToStep(spriteStep: number, i: number): void {
        if (spriteStep == -1)
            return
        this.steps[spriteStep].Iterations.push(i);
    }
}

export class SpriteLoaderStep {
    public Title: string;
    public Method: (_: number, __: () => void) => void;
    public OnFinish: () => boolean;
    public Iterations: number[];
    constructor(title: string, method: (_: number, __: () => void) => void, onFinish: () => boolean) {
        this.Title = title;
        this.Method = method;
        this.OnFinish = onFinish;
        this.Iterations = new Array<number>();
    }
}