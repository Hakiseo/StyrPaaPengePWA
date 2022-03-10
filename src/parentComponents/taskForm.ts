import {html, LitElement, TemplateResult} from "lit";
import {property} from "lit/decorators.js";
import {customElement} from "lit/decorators.js";
import {ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/buttonElement"
import "../sharedComponents/inputElement"

@customElement("task-form")
export class TaskForm extends LitElement implements ICustomErrorHandling {
    @property({type: Boolean}) createForm: boolean = false;
    @property({type: Boolean}) detailForm: boolean = false;
    @property({type: String}) taskName: string = "";
    @property({type: String}) taskContent: string = "";
    @property({type: String}) taskRewardAmount: number = 100; //We can set the standard target to whatever we want

    @property() errorMessage: string = "";

    @property() taskNameValid: boolean = true;
    @property() taskContentValid: boolean = true;
    @property() taskRewardAmountValid: boolean = true;

    validated() {
        this.taskNameValid = this.taskName.length > 0
        this.taskContentValid = this.taskContent.length > 0
        this.taskRewardAmountValid = this.taskRewardAmount.toString().length > 0

        if (this.taskNameValid && this.taskContentValid && this.taskRewardAmountValid) {
            return true;
        }else{
            this.errorMessage = "All fields are required!"
            return false
        }
    }

    protected render(): TemplateResult {
        return html`
            <div>
                <input-element .valid="${this.taskNameValid}" label="Navn" .value="${this.taskName}" @changeValue="${(e: CustomEvent) => this.taskName = e.detail}"></input-element>
                <input-element .valid="${this.taskContentValid}" label="Beskrivelse" .value="${this.taskContent}" @changeValue="${(e: CustomEvent) => this.taskContent = e.detail}"></input-element>
                <input-element .valid="${this.taskRewardAmountValid}" .inputType="${InputType.number}" label="Beløb" .value="${this.taskRewardAmount}" @changeValue="${(e: CustomEvent) => this.taskRewardAmount = e.detail}"></input-element>
                ${this.renderSubmitButton()}
            </div>
        `;
    }

    //TODO: Add assigned To
    submitForm() {
        if(this.validated()){
            this.dispatchEvent(
                new CustomEvent("submit", {
                    detail: {
                        taskName: this.taskName,
                        taskContent: this.taskContent,
                        taskRewardAmount: this.taskRewardAmount
                    }
                })
            )
        }else{
            window.alert(this.errorMessage)
        }
    }

    //kunne være skrevet inline i render funktionen men adskiller det for at gøre det mere læsbart.
    //Hvis vi ville beholde knappen i renderfunktionen så kan vi i knap-teksten sige ${this.createForm ? "Opret" : "Gem Ændringer"}
    renderSubmitButton() {
        if (this.createForm) {
            return html `
            <button-element .action="${() => this.submitForm()}"> Opret </button-element>
        `}
        if(this.detailForm){
            return html `
            <button-element .action="${() => this.submitForm()}"> Gem Ændringer </button>
        `}
        return html `
            <button-element .action="${() => this.submitForm()}"> Redigere </button>
        `
    }
}