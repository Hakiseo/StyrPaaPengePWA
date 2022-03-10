import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {IChildData} from "./parentInterfaces";
import {router} from "../index";
import {deleteChild, editChild, fetchChild} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/inputElement"
import "../sharedComponents/buttonElement"
import "../sharedComponents/textDisplayElement"

@customElement("child-details")
export class ChildDetails extends LitElement implements ICustomErrorHandling{
    @property() childData!: IChildData;
    @property() childId: string = "";
    @property() editMode: boolean = false;

    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() username: string = "";
    @property() age: number = 0;
    @property() balance: number = 0;

    @property() errorMessage: string = "";

    validated() {
        return true;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.childData) {
            console.log("Make an API request with the id: ", this.childId)
            this.getChildData()
        }
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("childData")) {
            this.firstName = this.childData.first_name
            this.lastName = this.childData.last_name
            this.username = this.childData.username
            this.age = this.childData.age
            this.balance = this.childData.reward_balance
        }
    }

    protected render(): TemplateResult {
        if (!this.childData) return html ` <p> Loading... </p>`
        return html `
            ${this.editMode ? this.renderEdit() : this.renderView()}
            <div>
                <button-element .action="${() => this.deleteJunior()}"> Slet </button-element>
                <button-element .action="${() => router.navigate(`/parent/childDetails/${this.childData.id}/changePassword`)}"> Ændre Password </button-element>
                <button-element .action="${() => this.detailsAction()}"> ${this.editMode ? "Gem" : "Rediger"} </button-element>
            </div>
        `
    }

    renderView(): TemplateResult {
        return html `
            <div>
                <p-element> Id: ${this.childData.id} </p-element>
                <p-element> Fornavn: ${this.childData.first_name} </p-element>
                <p-element> Efternavn: ${this.childData.last_name} </p-element>
                <p-element> Brugernavn: ${this.childData.username} </p-element>
                <p-element> Alder: ${this.childData.age} </p-element>
                <p-element> Saldo: ${this.childData.reward_balance} </p-element>
            </div>
        `
    }

    //TODO: ADD TASK PREVIEWS AFTER MERGE
    renderTaskPreviews(): TemplateResult | void {
        //TODO: Add a check for task and return empty if no task is found
        return html `
            <div>
                <h3> Task Previews:</h3>
            </div>
        `
    }

    //TODO: validate input & visually show errors
    renderEdit(): TemplateResult {
        return html `
            <div>
                <input-element label="Fornavn" .value="${this.childData.first_name}" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
                <input-element label="Efternavn" .value="${this.childData.last_name}" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
                <input-element label="Brugernavn" .value="${this.childData.username}" @changeValue="${(e: CustomEvent) => this.username = e.detail}"></input-element>
                <input-element .inputType="${InputType.number}" label="alder" .value="${this.childData.age}" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
                <input-element .inputType="${InputType.number}" label="Saldo" .value="${this.childData.reward_balance}" @changeValue="${(e: CustomEvent) => this.balance = e.detail}"></input-element>
            </div>
        `
    }

    deleteJunior() {
        console.log("Delete junior user: ", this.childData.username)
        deleteChild(this.childId).then((r: IApiResponse) => {
            console.log(r)
            if (!r.error) {
                router.navigate("/parent")
            }
        })
    }

    //TODO: add validation
    detailsAction() {
        if (!this.editMode) {
            this.editMode = true;
        } else {
            //check for changes & valid inputs
            console.log(this.firstName, this.lastName, this.username, this.age, this.balance)

            editChild({id: this.childId, first_name: this.firstName, last_name: this.lastName, username: this.username, age: this.age, balance: this.balance})
                .then((r: IApiResponse) => {
                    console.log(r)
                    this.getChildData().then(() => this.editMode = false)
                })
        }
    }

    getChildData(): Promise<void> {
        return fetchChild(this.childId).then((r: IApiResponse) => {
            if (r.results) {
                this.childData = r.results[0]
            }
        })
    }
}