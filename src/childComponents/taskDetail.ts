import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {ITasklist} from "./childInterfaces";
import {confirm_Task, getTask} from "../api/childApiRequests";
import { router } from "../index";

@customElement("task-detail-page")
export class TaskDetailPage extends LitElement {
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
        console.log("TEST")
        if (!this.task) return html `Loading ...`;
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
            //TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            this.goBack()
        }
    }
}