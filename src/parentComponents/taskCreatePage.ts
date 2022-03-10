import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {IApiResponse, ICustomErrorHandling} from "../sharedComponents/sharedInterfaces";
import {create_Task} from "../api/parentApiRequests";
import { router } from "../index";
import "../parentComponents/taskForm";
import "../sharedComponents/buttonElement";
import {getCurrentUserId} from "../api/apiUtils";
import {IMinimalChildrenData} from "./parentInterfaces";

@customElement("task-create-page")
export class TaskCreatePage extends LitElement implements ICustomErrorHandling {
    @property({type: String}) errorMessage: string = "";
    @property() minChildData: IMinimalChildrenData[] = []

    validated() {
        return true;
    }

    constructor(){
        super();
    }

    goBack(){
        router.navigate("/tasklist-overview")
    }

    render(): TemplateResult{
        console.log("creat page: ", this.minChildData)
        return html`
            <h1>Opret Opgave:</h1>
            <button-element .action=${() => this.goBack()}>Tilbage</button-element><br>
            <task-form .minChildData="${this.minChildData}" .createForm="${true}" @submit="${(e: CustomEvent) => {
                this.createTask(e)
            }}"></task-form>
        `;
    }

    createTask(e: CustomEvent){
        console.log("New task created: ", e.detail)
        if (e.detail.taskName && e.detail.taskContent && e.detail.taskRewardAmount) {
            create_Task({
                creator_id: getCurrentUserId(),
                task_name: e.detail.taskName,
                content: e.detail.taskContent,
                reward_amount: e.detail.taskRewardAmount,
                junior_id: e.detail.childId
            }).then((r : IApiResponse) => {
                    if (r.error) {
                        this.errorMessage = r.error
                    }
                })
            if(this.errorMessage) {
                window.alert("Fejl... " + this.errorMessage)
            }else{
                window.alert("Oprettet Opgave: " + e.detail.taskName);
                this.goBack()
            }
        }else{
            window.alert("No fields may be left empty'!");
        }
    }
}
