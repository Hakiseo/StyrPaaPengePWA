import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "./sharedInterfaces";
import {ITasklist} from "../childComponents/childInterfaces";
import {confirm_Task, getTask} from "../api/childApiRequests";
import {reject_TaskParent, getTaskParent, delete_Task, update_Task} from "../api/parentApiRequests";
import { router } from "../index";
import "../parentComponents/taskForm";

@customElement("task-detail-page")
export class TaskDetailPage extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: Boolean}) parentConfirmMode: boolean = false;
    @property({type: String}) errorMessage: string | null = "";

    @property() taskID: string = "";
    @property() task!: ITasklist;
    @property() editMode: boolean = false;

    constructor() {
        super();
    }

    render() : TemplateResult{
        if (!this.task) return html `Loading ...`;
        return html`
            <h1>Opgave:${this.task.task_name}</h1>
            <img src="${this.task.img}" alt="Wish Icon" width="200" height="200"><br><br>
            ${!this.parentView ? this.renderChildInfoForm() : this.editMode ? this.renderParentEditForm() : this.renderParentInfoForm()}
        `;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        console.log("taskID: ", this.taskID)
        if (_changedProperties.has("taskID")) {
            this.loadTask();
        }
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Error loading task info... </p>
        `;
    }

    loadTask(){
        this.getHandler().then((r : apiResponse) => {
            if(r.results !== null){
                let tempTaskList:ITasklist[] = r.results;
                this.task = tempTaskList[0]
            }else{
                this.errorMessage = r.error;
            }
        });
    }

    getHandler(){
        if(this.parentView) {
            return getTaskParent(this.taskID)
        }else{
            return getTask(this.taskID)
        }
    }

    //TODO Child:
    renderChildInfoForm(){
        return html `
            <button @click=${() => this.goBackChild()}>Tilbage</button><br>
            <p> ${this.task.task_name} </p>
            <p> ${this.task.content} </p>
            <p> ${this.task.reward_amount} </p>
            <button @click=${() => this.confirmTaskChild()}>Udført</button><br>
        `;
    }

    goBackChild(){
        router.navigate("/child")
    }

    confirmTaskChild(){
        confirm_Task("1", this.task.id).then((r : apiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackChild()
        }
    }

    //TODO Parent:
    renderParentInfoForm(){
        return html `
            <button @click=${() => this.goBackParent()}>Tilbage</button><br>
            <p>${this.task.task_name}</p><br>
            <p>${this.task.content}</p><br>
            <p>${this.task.reward_amount}</p><br>
            <p>Assigned Junior-konto here: </p><br>
            ${this.parentConfirmMode ? this.renderConfirmMode() : this.renderDetailMode()}
        `;
    }

    renderConfirmMode(){
        return html `
            <button @click=${() => this.confirmTaskParent()}>Godkend</button><br>
            <button @click=${() => this.rejectTaskParent()}>Afvis</button>
        `;
    }

    renderDetailMode(){
        return html `
            <button @click=${() => this.confirmTaskParent()}>Godkend</button><br>
            <button @click=${() => this.rejectTaskParent()}>Afvis</button><br>
            <button @click=${() => this.editMode = true}>Redigér Opgave</button><br>
            <button @click=${() => this.deleteTaskParent()}>Slet Opgave</button><br>
        `;
    }

    rejectTaskParent(){
        reject_TaskParent("0", this.task.id).then((r : apiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/parent");
        }
    }

    renderParentEditForm(){
        return html `
            <button @click=${() => this.goBackParent()}>Tilbage</button><br>
            <task-form .detailForm="${true}"
                       .taskName="${this.task.task_name}"
                       .taskContent="${this.task.content}"
                       .taskRewardAmount="${this.task.reward_amount}"
                       @submit="${(e: CustomEvent) => {this.updateTaskParent(e);}}"
            ></task-form>
            <button @click=${this.editMode = false, () => this.loadTask()}>Annullere</button><br>
        `;
    }

    goBackParent(){
        if(this.parentConfirmMode){
            router.navigate("/parent")
        }else{
            router.navigate("/tasklist-overview")
        }
    }

    updateTaskParent(e : CustomEvent){
        console.log("Task updated: ", e.detail)
        if (e.detail.taskName && e.detail.taskContent && e.detail.taskRewardAmount) {
            update_Task(this.task.id, e.detail.taskName, e.detail.taskContent, e.detail.taskRewardAmount).then((r : apiResponse) => {
                this.errorMessage = r.error
                this.loadTask();
            })
            if(this.errorMessage || this.errorMessage == ""){
                this.renderError()
            }else{
                this.editMode = false;
            }
        } else {
            window.alert("No fields may be left empty'!");
        }
    }

    confirmTaskParent(){
        console.log("BØR VI BARE SLETTE DEN HER, ELLER SKAL VI LAVE EN NY BOOL VÆRDI I DATABASEN?");
        //TODO, BØR VI BARE SLETTE DEN HER, ELLER SKAL VI LAVE EN NY BOOL VÆRDI I DATABASEN?
    }

    deleteTaskParent(){
        delete_Task(this.task.id).then((r : apiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackParent()
        }
    }
}