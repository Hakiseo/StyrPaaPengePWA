import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "./sharedInterfaces";
import {ITasklist} from "../childComponents/childInterfaces";
import {confirm_Task, getTask} from "../api/childApiRequests";
import { router } from "../index";
import {reject_TaskParent} from "../api/parentApiRequests";

@customElement("task-detail-page")
export class TaskDetailPage extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: String}) errorMessage: string | null = "";

    @property() taskID: string = "";
    @property() task!: ITasklist;

    constructor() {
        super();
    }

    goBack(){
        router.navigate("/child")
    }

    render() : TemplateResult{
        if (!this.task) return html `Loading ...`;
        console.log("This is parentView: " + this.parentView)

        //TODO PROBLEMER MED BOOL VÆRDIERNE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // KIG PÅ HVAD DER FOREGÅR HER:
        if(this.parentView == true){

            //TODO DETTE SKABER PROBLEMER HELE VEJEN NED
            console.log("This is parentView - BØR VÆRE TRUE: " + this.parentView)

            return html`
                <h1>Opgave:</h1>
                ${this.renderParentView()}
                <button @click=${() => this.rejectTask()}>Afvis</button><br>
                <button @click=${() => this.parentConfirmTask()}>Godkend</button><br>
            `;
        }else{

            //TODO DETTE SKABER PROBLEMER HELE VEJEN NED
            console.log("This is parentView - BØR VÆRE FALSE: " + this.parentView)

            return html`
                <h1>Opgave: ${this.task.task_name}</h1>
                <img src="${this.task.img}" alt="Task Icon" width="200" height="200"><br><br>
    
                <button @click=${() => this.goBack()}>Tilbage</button><br>
                
                <p> ${this.task.task_name} </p>
                <p> ${this.task.content} </p>
                <p> ${this.task.reward_amount} </p>
                
                <button @click=${() => this.confirmTask()}>Udført</button><br>
            `;
        }
    }

    renderParentView(){
        return html `
            <h3>${this.task.task_name}</h3><br>
            <h3>${this.task.content}</h3><br>
            <h3>${this.task.reward_amount}</h3><br>
            <h3>Assigned Junior-konto here: </h3><br>
        `;
    }

    rejectTask(){
        reject_TaskParent("0", this.task.id).then((r : apiResponse) => {
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/parent");
        }
    }

    parentConfirmTask(){
        console.log("BØR VI BARE SLETTE DEN HER, ELLER SKAL VI LAVE EN NY BOOL VÆRDI I DATABASEN?");
        //TODO, BØR VI BARE SLETTE DEN HER, ELLER SKAL VI LAVE EN NY BOOL VÆRDI I DATABASEN?
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        console.log("taskID: ", this.taskID)
        if (_changedProperties.has("taskID")) {
            getTask(this.taskID).then((r : apiResponse) => {
                if(r.results !== null){
                    let tempTaskList:ITasklist[] = r.results;
                    this.task = tempTaskList[0]
                }else{
                    this.errorMessage = r.error;
                }
                if(this.errorMessage){
                    this.renderError()
                }
            });
        }
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Error loading task info... </p>
        `;
    }

    confirmTask(){
        confirm_Task("1", this.task.id).then((r : apiResponse) => {
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBack()
        }
    }
}