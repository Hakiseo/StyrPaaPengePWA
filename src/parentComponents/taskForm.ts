import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {property} from "lit/decorators.js";
import {customElement} from "lit/decorators.js";
import {ICustomErrorHandling, InputType, IApiResponse} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/buttonElement"
import "../sharedComponents/inputElement"
import {IMinimalChildrenData} from "./parentInterfaces";
import {fetchJuniors} from "../api/parentApiRequests";
import {getCurrentUserId} from "../api/apiUtils";

enum TaskTemplate {
    custom = "Custom",
    vacuuming = "Vacuuming",
    dishes = "Dishes",
    cleaning = "Cleaning"
}

@customElement("task-form")
export class TaskForm extends LitElement implements ICustomErrorHandling {
    @property({type: Boolean}) createForm: boolean = false;
    @property({type: Boolean}) detailForm: boolean = false;
    @property({type: String}) assignedID: string = "";
    @property({type: String}) taskName: string = "";
    @property({type: String}) taskContent: string = "";
    @property({type: String}) taskRewardAmount: number = 100; //We can set the standard target to whatever we want

    @property() minChildData: IMinimalChildrenData[] = []
    @property() chosenChildId: number = 0;
    @property() chosenTemplate: TaskTemplate = TaskTemplate.custom;

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

    connectedCallback() {
        super.connectedCallback();
        if (this.minChildData.length < 1) {
            fetchJuniors(getCurrentUserId()).then((r: IApiResponse) => {
                if (r.results) {
                    this.minChildData = r.results.map(child => {
                        return {id: child.id, firstName: child.first_name, lastName: child.last_name}
                    })
                }
            })
        }
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("minChildData") && this.minChildData.length > 0) {
            this.chosenChildId = this.minChildData[0].id
        }
    }

    protected render(): TemplateResult {
        if (this.minChildData.length < 1) {
            return html`
                <p> Not possible to make a task without children to assign them to. </p>
                <p> Go back and make some children! *wink wink*</p>
            `
        }
        return html`
            <div>
                <select @change="${(e: any) => {
                    this.chosenTemplate = e.target.value
                    console.log(this.chosenTemplate)
                    this.fillInputs()
                }}">
                    <option selected value="${TaskTemplate.custom}"> Custom </option>
                    <option value="${TaskTemplate.vacuuming}"> Støvsugning </option>
                    <option value="${TaskTemplate.dishes}"> Opvask </option>
                    <option value="${TaskTemplate.cleaning}"> Oprydning </option>
                </select>
                <input-element .valid="${this.taskNameValid}" label="Navn" .value="${this.taskName}" @changeValue="${(e: CustomEvent) => this.taskName = e.detail}"></input-element>
                <input-element .valid="${this.taskContentValid}" label="Beskrivelse" .value="${this.taskContent}" @changeValue="${(e: CustomEvent) => this.taskContent = e.detail}"></input-element>
                <input-element .valid="${this.taskRewardAmountValid}" .inputType="${InputType.number}" label="Beløb" .value="${this.taskRewardAmount}" @changeValue="${(e: CustomEvent) => this.taskRewardAmount = e.detail}"></input-element>
                ${this.renderJuniorChoices()}
                ${this.renderSubmitButton()}
            </div>
        `;
    }

    submitForm() {
        if(this.validated()){
            this.dispatchEvent(
                new CustomEvent("submit", {
                    detail: {
                        taskName: this.taskName,
                        taskContent: this.taskContent,
                        taskRewardAmount: this.taskRewardAmount,
                        childId: this.chosenChildId
                    }
                })
            )
        }else{
            window.alert(this.errorMessage)
            this.errorMessage = "";
        }
    }

    //TODO Remember to style the option tag and the whole section
    renderJuniorChoices() {
        if (!this.minChildData) return html `<p> Loading child Data... </p>`
        return html `
            <select id="2" @change="${(e: any) => this.chosenChildId = parseInt(e.target.value)}">
                ${this.minChildData.map((child) => {
                    return html `
                    <option value="${child.id}" ?selected=${Number(this.assignedID) === child.id} > ${child.firstName + " " + child.lastName}</option>
                `
                })}
            </select>
        `
    }

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
        `;
    }

    //Pre-filled inputs according to templates
    fillInputs() {
        switch (this.chosenTemplate) {
            case TaskTemplate.vacuuming:
                this.taskName = "Støvsugning"
                this.taskContent = "Støvsug i hele hjemmet"
                this.taskRewardAmount = 50
                return;
            case TaskTemplate.dishes:
                this.taskName = "Opvask"
                this.taskContent = "Vask op, tør af og sæt dem tilbage på deres plads"
                this.taskRewardAmount = 40
                return;
            case TaskTemplate.cleaning:
                this.taskName = "Oprydning"
                this.taskContent = "Ryd op på værelset"
                this.taskRewardAmount = 30
                return;
            default:
                this.taskName = ""
                this.taskContent = ""
                this.taskRewardAmount = 100
        }
    }
}