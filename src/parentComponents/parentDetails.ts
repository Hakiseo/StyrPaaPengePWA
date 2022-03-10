import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {IParentData} from "./parentInterfaces";
import {router} from "../index";
import {deleteParent, editParent, getCurrentParent} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
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
    @property() age: number = 3;

    @property() errorMessage: string = "";

    validated() {
        //TODO: check if age can be parsed as int - Check if age is an int
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
                <button-element .action="${() => this.deleteParent()}"> Slet </button-element>
                <button-element .action="${() => router.navigate(`/parent/details/changePassword`)}"> Ændre Password </button-element>
                <button-element .action="${() => this.detailsAction()}"> ${this.editMode ? "Gem" : "Rediger"} </button-element>
            </div>
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

    //TODO: validate input & visually show errors
    renderEdit(): TemplateResult {
        return html `
            <div>
                <input-element label="Fornavn" .value="${this.parentData.first_name}" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
                <input-element label="Efternavn" .value="${this.parentData.last_name}" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
                <input-element .inputType="${InputType.email}" label="Email" .value="${this.parentData.email}" @changeValue="${(e: CustomEvent) => this.email = e.detail}"></input-element>
                <input-element .inputType="${InputType.number}" label="Alder" .value="${this.parentData.age}" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
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
        } else {
            //check for changes
            if (this.validated()) {
                editParent({id: getCurrentUserId(), first_name: this.firstName, last_name: this.lastName, age: this.age, email: this.email})
                    .then((r:IApiResponse) => {
                        console.log(r)
                        this.getParentData().then(() => this.editMode = false)
                    })
            } else {
                this.errorMessage = ""
            }
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