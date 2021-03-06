import IDisplayContext = etch.drawing.IDisplayContext;
import {PostEffect} from '../PostEffect';
import Point = etch.primitives.Point;
import {IApp} from "../../../IApp";

declare var App: IApp;

export class Reverb extends PostEffect {

    public Effect: Tone.Freeverb;
    public Params: ReverbParams;
    public Defaults: ReverbParams;

    Init(drawTo: IDisplayContext): void {

        this.BlockName = App.L10n.Blocks.Effect.Blocks.Reverb.name;

        this.Defaults = {
            dampening: 0.7,
            roomSize: 0.5,
            mix: 0.5
        };

        this.PopulateParams();

        this.Effect = new Tone.Freeverb(this.Params.dampening, this.Params.roomSize);
        this.Effect.wet.value = this.Params.mix;

        super.Init(drawTo);

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, -1),new Point(1, -1),new Point(2, 0),new Point(0, 2),new Point(-1, 1));
    }

    Draw() {
        super.Draw();
        this.DrawSprite(this.BlockName);
    }

    Dispose(){
        this.Effect.dispose();
    }

    SetParam(param: string,value: number) {
        super.SetParam(param,value);
        var val = value;

        if (param=="mix") {
            this.Effect.wet.value = val;
        } else if (param=="dampening") {
            this.Effect.dampening.value = val;
        } else if (param=="roomSize") {
            this.Effect.roomSize.value = val;
        }

        this.Params[param] = val;
    }

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name" : App.L10n.Blocks.Effect.Blocks.Reverb.name,
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Room Size",
                    "setting" :"roomSize",
                    "props" : {
                        "value" : this.Params.roomSize,
                        "min" : 0.1,
                        "max" : 0.95,
                        "quantised" : false,
                        "centered" : false
                    }
                },

                {
                    "type" : "slider",
                    "name" : "Dampening",
                    "setting" :"dampening",
                    "props" : {
                        "value" : this.Params.dampening,
                        "min" : 0.1,
                        "max" : 1,
                        "quantised" : false,
                        "centered" : false
                    }
                },


                {
                    "type" : "slider",
                    "name" : "Mix",
                    "setting" :"mix",
                    "props" : {
                        "value" : this.Params.mix,
                        "min" : 0,
                        "max" : 1,
                        "quantised" : false,
                        "centered" : false
                    }
                }
            ]
        };
    }
}
