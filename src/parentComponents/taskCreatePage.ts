import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {ApiResponse} from "../sharedComponents/sharedInterfaces";
import {create_Task} from "../api/parentApiRequests";
import { router } from "../index";
import "../parentComponents/taskForm";
import {getCurrentUserId} from "../api/apiUtils";

@customElement("task-create-page")
export class TaskCreatePage extends LitElement { //implements CustomErrorHandling {
    @property({type: String}) errorMessage: string | null = "";
    //@property() errorMessage: string = "";

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
        return html`
            <h1>Opret Opgave:</h1>
            <button @click=${() => this.goBack()}>Tilbage</button><br>
            <task-form .createForm="${true}" @submit="${(e: CustomEvent) => {
            this.createTask(e)
        }}"></task-form>
        `;
    }

    createTask(e: CustomEvent){
        console.log("New task created: ", e.detail)
        if (e.detail.taskName && e.detail.taskContent && e.detail.taskRewardAmount) {
            create_Task(
                getCurrentUserId(),
                e.detail.taskName,
                e.detail.taskContent,
                e.detail.taskRewardAmount)
                .then((r : ApiResponse) => {
                    this.errorMessage = r.error
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
