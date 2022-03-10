import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {IParentData} from "./parentInterfaces";
import {router} from "../index";
import {deleteParent, editParent, getCurrentParent} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling} from "../sharedComponents/sharedInterfaces";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement";

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
                <p> Id: ${this.parentData.id} </p>
                <p> Fornavn: ${this.parentData.first_name} </p>
                <p> Efternavn: ${this.parentData.last_name} </p>
                <p> Email: ${this.parentData.email} </p>
                <p> Alder: ${this.parentData.age} </p>
            </div>
        `
    }

    //TODO: validate input & visually show errors
    renderEdit(): TemplateResult {
        return html `
            <div>
                <label for="firstName"> Fornavn: </label>
                <input type="text" value="${this.parentData.first_name}" id="firstName" name="firstName" @change="${(e: any) => this.firstName = e.target.value}"><br><br>
                <label for="lastName"> Efternavn: </label>
                <input type="text" value="${this.parentData.last_name}" id="lastName" name="lastName" @change="${(e: any) => this.lastName = e.target.value}"><br><br>
                <label for="email"> Email: </label>
                <input type="text" value="${this.parentData.email}" id="email" name="email" @change="${(e: any) => this.email = e.target.value}"><br><br>
                <label for="age"> Alder: </label>
                <input type="number" value="${this.parentData.age}" id="age" name="age" @change="${(e: any) => this.age = e.target.value}"><br><br>
            </div>
        `
    }

    deleteParent() {
        console.log("Delete Parent user: ", this.parentData.email)
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