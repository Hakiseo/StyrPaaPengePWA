import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {ButtonType, IApiResponse, ITasklist} from "./sharedInterfaces";
import {confirm_Task, getTask, retract_Task} from "../api/childApiRequests";
import {
    reject_TaskParent,
    getTaskParent,
    delete_Task,
    update_Task,
    confirm_TaskParent, fetchMinimalChild, reOpenTask
} from "../api/parentApiRequests";
import { router } from "../index";
import "../parentComponents/taskForm";
import "./buttonElement";
import "./textDisplayElement";
import {IMinimalChildrenData} from "../parentComponents/parentInterfaces";
import "../sharedComponents/errorMessage"

@customElement("task-detail-page")
export class TaskDetailPage extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: Boolean}) parentConfirmMode: boolean = false;
    @property({type: String}) errorMessage: string | null = "";

    @property() task!: ITasklist;
    @property() minChildData!: IMinimalChildrenData;

    @property() taskID: string = "";
    @property() editMode: boolean = false;

    render() : TemplateResult{
        if (!this.task) return html `Loading ...`;
        return html`
            <h1>Opgave: ${this.task.task_name}</h1>
            <img src="${this.task.img}" alt="Wish Icon" width="200" height="200">
            ${!this.parentView ? this.renderChildInfoForm() : this.editMode ? this.renderParentEditForm() : this.renderParentInfoForm()}
        `;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("taskID")) {
            this.loadTask();
        }
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    loadTask(){
        this.getHandler().then((r : IApiResponse) => {
            if(r.results !== null){
                let tempTaskList:ITasklist[] = r.results;
                this.task = tempTaskList[0]
            }
            if(r.error){
                this.errorMessage = "Error loading task data..."
                this.displayError()
            }
            if(this.parentView && this.task){
                this.loadChildData();
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

    loadChildData(){
        if(this.parentView && this.task) {
            fetchMinimalChild(this.task.assigned_to).then((r : IApiResponse) =>{
                if(r.results !== null){
                    let tempList:any = r.results[0];
                    this.minChildData ={id:tempList.id, firstName:tempList.first_name, lastName:tempList.last_name}
                }
                if(r.error){
                    this.errorMessage = "Error loading child data..."
                    this.displayError()
                }
            })
        }
    }

    //TODO Child:
    renderChildInfoForm(){
        return html `
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBackChild()}>Tilbage</button-element>
            <p-element> Beskrivelse: ${this.task.content} </p-element>
            <p-element> Belønning: ${this.task.reward_amount} kroner </p-element>
            ${this.task.current_status ?
                    html`<button-element .buttonType="${ButtonType.navigate}" .action=${() => this.retractTaskChild()}>Annullere</button-element>` :
                    html`<button-element .buttonType="${ButtonType.confirm}" .action=${() => this.confirmTaskChild()}>Udført</button-element>`}
        `;
    }

    goBackChild(){
        router.navigate("/child")
    }

    retractTaskChild(){
        retract_Task(this.task.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error rejecting wish..."
                this.displayError()
            }else{
                this.goBackChild()
            }
        })
    }

    confirmTaskChild(){
        confirm_Task(this.task.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error confirming wish..."
                this.displayError()
            }else{
                this.goBackChild()
            }
        })
    }

    //TODO Parent:
    renderParentInfoForm(){
        if(this.minChildData){
            return html `
                <p-element> Beskrivelse: ${this.task.content}</p-element>
                <p-element> Belønning: ${this.task.reward_amount} kroner</p-element>
                <p-element> Barn: ${this.minChildData.firstName} ${this.minChildData.lastName}</p-element>
                <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBackParent()}>Tilbage</button-element>
                ${this.parentConfirmMode ? this.renderConfirmMode() : this.renderDetailMode()}
            `;
        }else{
            return html `
                <error-message> Error loading Child data </error-message>
            `;
        }
    }

    renderConfirmMode(){
        if (this.task.done_status) {
            return html `
            <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.reOpenTaskParent()}>Genåbn opgave</button-element>
        `;
        }
        return html `
            <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.confirmTaskParent()}>Godkend</button-element>
            <button-element .buttonType="${ButtonType.deny}" .action=${() => this.rejectTaskParent()}>Afvis</button-element>
        `;
    }

    renderDetailMode(){
        return html `
            <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.editMode = true}>Redigér Opgave</button-element>
            <button-element .buttonType="${ButtonType.delete}" .deleteMessage="Er du sikker på at du vil slette opgaven?" .action=${() => this.deleteTaskParent()}>Slet Opgave</button-element>
            ${this.task.current_status ? html `<button-element .buttonType="${ButtonType.deny}" .action=${() => this.rejectTaskParent()}>Afvis</button-element>` : ''}
            <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.confirmTaskParent()}>Godkend</button-element>
        `;
    }

    rejectTaskParent(){
        reject_TaskParent(this.task.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error rejecting wish..."
                this.displayError()
            }else{
                router.navigate("/parent");
            }
        })
    }

    renderParentEditForm(){
        return html `
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBackParent()}>Tilbage</button-element>
            <task-form .detailForm="${true}"
                       .assignedID="${this.task.assigned_to}"
                       .taskName="${this.task.task_name}"
                       .taskContent="${this.task.content}"
                       .taskRewardAmount="${this.task.reward_amount}"
                       @submit="${(e: CustomEvent) => {this.updateTaskParent(e);}}"
            ></task-form>
            <button-element .buttonType="${ButtonType.navigate}" .action=${this.editMode = false, () => this.loadTask()}>Annullere</button-element>
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
        if (e.detail.taskName && e.detail.taskContent && e.detail.taskRewardAmount) {
            update_Task(this.task.id, e.detail.taskName, e.detail.taskContent, e.detail.taskRewardAmount, e.detail.childId).then((r : IApiResponse) => {
                if(r.error){
                    this.errorMessage = "Error updating task..."
                    this.displayError()
                }else{
                    this.editMode = false;
                }
                this.loadTask();
            })
        }else{
            window.alert("No fields may be left empty'!");
        }
    }

    reOpenTaskParent() {
        reOpenTask(this.task.id).then((r: IApiResponse) => {
            if (r.error) {
                this.errorMessage = "Error Re-opening task... " + r.error
                this.displayError()
            } else {
                this.goBackParent()
            }
        })
    }

    confirmTaskParent(){
        confirm_TaskParent(this.task.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error confirming wish..."
                this.displayError()
            }else{
                this.goBackParent()
            }
        })
    }

    deleteTaskParent(){
        delete_Task(this.task.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error deleting wish..."
                this.displayError()
            }else{
                this.goBackParent()
            }
        })
    }
}