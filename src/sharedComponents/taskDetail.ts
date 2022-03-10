import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {ApiResponse} from "./sharedInterfaces";
import {ITasklist} from "../childComponents/childInterfaces";
import {confirm_Task, getTask, retract_Task} from "../api/childApiRequests";
import {reject_TaskParent, getTaskParent, delete_Task, update_Task, confirm_TaskParent} from "../api/parentApiRequests";
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
        this.getHandler().then((r : ApiResponse) => {
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
            ${this.task.current_status ?
                    html`<button @click=${() => this.retractTaskChild()}>Annullere</button><br>` :
                    html`<button @click=${() => this.confirmTaskChild()}>Udført</button><br>`}
        `;
    }

    goBackChild(){
        router.navigate("/child")
    }

    retractTaskChild(){
        retract_Task(this.task.id).then((r : ApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackChild()
        }
    }

    confirmTaskChild(){
        confirm_Task(this.task.id).then((r : ApiResponse) => {
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
            ${this.task.current_status ? html `<button @click=${() => this.rejectTaskParent()}>Afvis</button><br>` : ''}
            <button @click=${() => this.editMode = true}>Redigér Opgave</button><br>
            <button @click=${() => this.deleteTaskParent()}>Slet Opgave</button><br>
        `;
    }

    rejectTaskParent(){
        reject_TaskParent(this.task.id).then((r : ApiResponse) => {
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
            update_Task(this.task.id, e.detail.taskName, e.detail.taskContent, e.detail.taskRewardAmount).then((r : ApiResponse) => {
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
        confirm_TaskParent(this.task.id).then((r : ApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/parent");
        }
    }

    deleteTaskParent(){
        delete_Task(this.task.id).then((r : ApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackParent()
        }
    }
}