import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {IApiResponse} from "./sharedInterfaces";
import {ITasklist} from "../childComponents/childInterfaces";
import {confirm_Task, getTask, retract_Task} from "../api/childApiRequests";
import {reject_TaskParent, getTaskParent, delete_Task, update_Task, confirm_TaskParent} from "../api/parentApiRequests";
import { router } from "../index";
import "../parentComponents/taskForm";
import "./buttonElement";
import "./textDisplayElement";

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
            <img src="${this.task.img}" alt="Wish Icon" width="200" height="200">
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
        this.getHandler().then((r : IApiResponse) => {
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
            <button @click=${() => this.goBackChild()}>Tilbage</button>
            <p-element> ${this.task.task_name} </p-element>
            <p-element> ${this.task.content} </p-element>
            <p-element> ${this.task.reward_amount} </p-element>
            ${this.task.current_status ?
                    html`<button-element .action=${() => this.retractTaskChild()}>Annullere</button-element>` :
                    html`<button-element .action=${() => this.confirmTaskChild()}>Udført</button-element>`}
        `;
    }

    goBackChild(){
        router.navigate("/child")
    }

    retractTaskChild(){
        retract_Task(this.task.id).then((r : IApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackChild()
        }
    }

    confirmTaskChild(){
        confirm_Task(this.task.id).then((r : IApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackChild()
        }
    }

    //TODO: Add assigned Junior Konto visually
    //TODO Parent:
    renderParentInfoForm(){
        return html `
            <button @click=${() => this.goBackParent()}>Tilbage</button>
            <p-element>${this.task.task_name}</p-element>
            <p-element>${this.task.content}</p-element>
            <p-element>${this.task.reward_amount}</p-element>
            <p-element>Assigned Junior-konto here: </p-element>
            ${this.parentConfirmMode ? this.renderConfirmMode() : this.renderDetailMode()}
        `;
    }

    renderConfirmMode(){
        return html `
            <button-element .action=${() => this.confirmTaskParent()}>Godkend</button-element>
            <button-element .action=${() => this.rejectTaskParent()}>Afvis</button-element>
        `;
    }

    renderDetailMode(){
        return html `
            <button-element .action=${() => this.confirmTaskParent()}>Godkend</button-element>
            ${this.task.current_status ? html `<button-element .action=${() => this.rejectTaskParent()}>Afvis</button-element>` : ''}
            <button-element .action=${() => this.editMode = true}>Redigér Opgave</button-element>
            <button-element .action=${() => this.deleteTaskParent()}>Slet Opgave</button-element>
        `;
    }

    rejectTaskParent(){
        reject_TaskParent(this.task.id).then((r : IApiResponse) => {
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
            <button-element .action=${() => this.goBackParent()}>Tilbage</button-element>
            <task-form .detailForm="${true}"
                       .taskName="${this.task.task_name}"
                       .taskContent="${this.task.content}"
                       .taskRewardAmount="${this.task.reward_amount}"
                       @submit="${(e: CustomEvent) => {this.updateTaskParent(e);}}"
            ></task-form>
            <button-element .action=${this.editMode = false, () => this.loadTask()}>Annullere</button-element>
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
            update_Task(this.task.id, e.detail.taskName, e.detail.taskContent, e.detail.taskRewardAmount).then((r : IApiResponse) => {
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
        confirm_TaskParent(this.task.id).then((r : IApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/parent");
        }
    }

    deleteTaskParent(){
        delete_Task(this.task.id).then((r : IApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackParent()
        }
    }
}