import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { HelloWorld, IHelloWorldProps } from "./HelloWorld";
import * as React from "react";

export class SpreadSheet implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private data: string;
    private onSave: boolean;
    private onCopy: boolean;
    private initialData: { value: string }[][];
    private year:string;
    private SubAccountsID:string[]=[]
    private FiscelYear:boolean;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
       
        this.notifyOutputChanged = notifyOutputChanged;
        if(context.parameters.jsonDataIn.raw){
        this.data = context.parameters.jsonDataIn.raw;}
        this.onSave=context.parameters.SaveData.raw
        this.onCopy=context.parameters.CopyData.raw
        this.year=context.parameters.Year.raw|| new Date().getFullYear().toString()
        this.FiscelYear=context.parameters.FiscelYear.raw
        console.log("till now")
      
        // console.log(this.data)
        try {
          
            this.initialData = JSON.parse(this.data).map((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>{
            
             const Items=Object.values(item).flat()
             this.SubAccountsID.push(String(Items.slice(15,16)))
            
             return (
              Items.slice(0,15).map(value => ({ value })))}
            );
          } catch (error) {
            // Assign default initialData structure in case of error
            this.initialData = [
              [
                { value: '' }, { value: '' }, { value: '' },
                { value: '' }, { value: '' }, { value: '' }, { value: '' },
                { value: '' }, { value: '' }, { value: '' }, { value: '' },
                { value: '' }, { value: '' }, { value: '' }, { value: '' }
              ]
            ];
          }
          console.log(this.initialData,"    asfjnasd")
          console.log(this.SubAccountsID)
console.log("till now")
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.notifyOutputChanged
        this.onSave=context.parameters.SaveData.raw
        this.onCopy=context.parameters.CopyData.raw
        this.notifyOutputChanged
        if(context.parameters.jsonDataIn.raw){
            this.data = context.parameters.jsonDataIn.raw;
            try {
              this.initialData = JSON.parse(this.data).map((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>{
            
                const Items=Object.values(item).flat()
                this.SubAccountsID.push(String(Items.slice(15,16)))
               
                return (
                 Items.slice(0,15).map(value => ({ value })))}
               );
                
              } catch (error) {
                // Assign default initialData structure in case of error
                this.initialData = [
                  [
                    { value: '' }, { value: '' }, { value: '' },
                    { value: '' }, { value: '' }, { value: '' }, { value: '' },
                    { value: '' }, { value: '' }, { value: '' }, { value: '' },
                    { value: '' }, { value: '' }, { value: '' }, { value: '' }
                  ]
                ];
              }}
        
          console.log("this is update")
          console.log(this.initialData)
        const props: IHelloWorldProps = {
            initialData:this.initialData,Year:this.year,OnSave:this.onSave,onCopy:this.onCopy,onDataChange:this.handleDataChange.bind(this),SubAccountsID:this.SubAccountsID,FiscelYear:this.FiscelYear
        };
        return React.createElement(
            HelloWorld, props
        );
        this.notifyOutputChanged()
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { jsonDataOut:this.data };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
    private handleDataChange(newData: string): void {
        this.data = newData;
        this.notifyOutputChanged()
        console.log(this.data,"This Update is Running")
        
    }
}
