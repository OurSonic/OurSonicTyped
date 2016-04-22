import {CanvasInformation} from "../Common/CanvasInformation";
export class Engine {

    private gameCanvasName = "gameLayer";
    private uiCanvasName = "uiLayer";

    public Engine() {

        this.gameCanvas = CanvasInformation.Create(document.getElementById(this.gameCanvasName), 0, 0, true);
        this.uiCanvas = CanvasInformation.Create(document.getElementById(this.uiCanvasName), 0, 0, true);
        //new SpeedTester(gameCanvas);return;
        canvasWidth = 0;
        canvasHeight = 0;

        bindInput();

        fullscreenMode = true;

        Window.AddEventListener("resize", e => resizeCanvas(true));
        jQuery.Document.Resize(e => resizeCanvas(true));

        sonicManager = new SonicManager(this, gameCanvas, () => resizeCanvas(true));
        sonicManager.IndexedPalette = 0;
        Window.SetInterval(sonicManager.Tick, 1000 / 60);
        Window.SetInterval(GameDraw, 1000 / 60);
        Window.SetInterval(UIDraw, 1000 / 10);
        resizeCanvas(true);
    }
}