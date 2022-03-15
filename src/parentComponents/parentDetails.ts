import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {IParentData} from "./parentInterfaces";
import {router} from "../index";
import {deleteParent, editParent, getCurrentParent} from "../api/parentApiRequests";
import {ButtonType, IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement";
import "../sharedComponents/inputElement";
import "../sharedComponents/textDisplayElement";

@customElement("parent-details")
export class ParentDetails extends LitElement implements ICustomErrorHandling {
    @property() parentData!: IParentData;
    @property() editMode: boolean = false;


    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() email: string = "";
    @property() age: number = 18;

    @property() firstNameValid: boolean = true;
    @property() lastNameValid: boolean = true;
    @property() emailValid: boolean = true;
    @property() ageValid: boolean = true;

    @property() errorMessage: string = "";

    validated() {
        this.firstNameValid = this.firstName.length > 0
        this.lastNameValid = this.lastName.length > 0
        this.ageValid = this.age >= 18
        this.emailValid = this.email.includes("@")

        if (!this.ageValid) {
            this.errorMessage = "You must be 18 years or older to register a parent account!"
            return false;
        }

        if (!this.emailValid) {
            this.errorMessage = "Please enter an email!"
            return false;
        }

        if (!this.firstNameValid || !this.lastNameValid || !this.ageValid || !this.emailValid) {
            this.errorMessage = "All fields are required!"
            return false;
        }

        return true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.getParentData();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("parentData")) {
            this.firstName = this.parentData.first_name
            this.lastName = this.parentData.last_name
            this.email = this.parentData.email
            this.age = this.parentData.age
        }
    }

    protected render(): TemplateResult {
        if (!this.parentData) return html ` <p> Loading... </p>`
        return html `
            ${this.editMode ? this.renderEdit() : this.renderView()}
            <div>
                ${this.renderButtons()}
            </div>
            <!--<error-message> ${this.errorMessage} </error-message>-->
        `
    }

    renderButtons() {
        if (this.editMode) {
            return html `
                <button-element .buttonType="${ButtonType.cancel}" .action="${() => this.editMode = false}"> Annuller </button-element>
                <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.detailsAction()}"> Gem </button-element>
            `
        }
        return html `
            <button-element .buttonType="${ButtonType.delete}" .action="${() => this.deleteParent()}"> Slet </button-element>
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => router.navigate(`/parent/details/changePassword`)}"> Ændre Password </button-element>
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.detailsAction()}"> Rediger </button-element>
        `
    }

    renderView(): TemplateResult {
        return html `
            <div>
                <p-element> Id: ${this.parentData.id} </p-element>
                <p-element> Fornavn: ${this.parentData.first_name} </p-element>
                <p-element> Efternavn: ${this.parentData.last_name} </p-element>
                <p-element> Email: ${this.parentData.email} </p-element>
                <p-element> Alder: ${this.parentData.age} </p-element>
            </div>
        `
    }

    renderEdit(): TemplateResult {
        return html `
            <div>
                <input-element .valid="${this.firstNameValid}" label="Fornavn" .value="${this.parentData.first_name}" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
                <input-element .valid="${this.lastNameValid}" label="Efternavn" .value="${this.parentData.last_name}" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
                <input-element .valid="${this.emailValid}" .inputType="${InputType.email}" label="Email" .value="${this.parentData.email}" @changeValue="${(e: CustomEvent) => this.email = e.detail}"></input-element>
                <input-element .valid="${this.ageValid}" .inputType="${InputType.number}" label="Alder" .value="${this.parentData.age}" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
            </div>
        `
    }

    deleteParent() {
        deleteParent().then((r: IApiResponse) => {
            if (!r.error) {
                this.dispatchEvent(new CustomEvent("logout"))
            }
        })
    }

    detailsAction() {
        if (!this.editMode) {
            this.editMode = true;
            return;
        }

        if (this.validated()) {
            editParent({id: getCurrentUserId(), first_name: this.firstName, last_name: this.lastName, age: this.age, email: this.email})
                .then((r:IApiResponse) => {
                    if (r.error) {
                        this.errorMessage = r.error
                    } else {
                        this.errorMessage = "";
                        console.log(r)
                        this.getParentData().then(() => this.editMode = false)
                    }
                })
        } else {
            alert(this.errorMessage)
        }
    }

    getParentData() {
        return getCurrentParent().then((r: IApiResponse) => {
            if (r.results) {
                this.parentData = r.results[0]
            }
        })
    }
}