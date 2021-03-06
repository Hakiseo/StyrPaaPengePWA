import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {ButtonType, IApiResponse, ICustomErrorHandling} from "../sharedComponents/sharedInterfaces";
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

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    render(): TemplateResult{
        return html`
            <h1>Opret Opgave:</h1>
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBack()}>Tilbage</button-element><br>
            <task-form .minChildData="${this.minChildData}" .createForm="${true}" @submit="${(e: CustomEvent) => {
                this.createTask(e)
            }}"></task-form>
        `;
    }

    createTask(e: CustomEvent){
        if (e.detail.taskName && e.detail.taskContent && e.detail.taskRewardAmount) {
            create_Task({
                creator_id: getCurrentUserId(),
                task_name: e.detail.taskName,
                content: e.detail.taskContent,
                reward_amount: e.detail.taskRewardAmount,
                junior_id: e.detail.childId,
                img: e.detail.img
                }).then((r : IApiResponse) => {
                if(r.error){
                    this.errorMessage = "Error creating task..."
                    this.displayError()
                }else{
                    this.goBack()
                }
            })
        }else{
            window.alert("No fields may be left empty'!");
        }
    }
}
