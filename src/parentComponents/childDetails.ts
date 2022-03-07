import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ChildData} from "./parentInterfaces";
import {router} from "../index";
import {editChild, fetchChild} from "../api/parentApiRequests";
import {ApiResponse, CustomErrorHandling} from "../sharedComponents/sharedInterfaces";

@customElement("child-details")
export class ChildDetails extends LitElement implements CustomErrorHandling{
    @property() childData!: ChildData;
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
                <button @click="${() => this.deleteJunior()}"> Slet </button>
                <button @click="${() => router.navigate(`/parent/childDetails/${this.childData.id}/changePassword`)}"> Ændre Password </button>
                <button @click="${() => this.detailsAction()}"> ${this.editMode ? "Gem" : "Rediger"} </button>
            </div>
        `
    }

    renderView(): TemplateResult {
        return html `
            <div>
                <p> Id: ${this.childData.id} </p>
                <p> Fornavn: ${this.childData.first_name} </p>
                <p> Efternavn: ${this.childData.last_name} </p>
                <p> Brugernavn: ${this.childData.username} </p>
                <p> Alder: ${this.childData.age} </p>
                <p> Saldo: ${this.childData.reward_balance} </p>
            </div>
        `
    }

    //TODO: validate input & visually show errors
    renderEdit(): TemplateResult {
        return html `
            <div>
                <label for="firstName"> Fornavn: </label>
                <input type="text" value="${this.childData.first_name}" id="firstName" name="firstName" @change="${(e: any) => this.firstName = e.target.value}"><br><br>
                <label for="lastName"> Efternavn: </label>
                <input type="text" value="${this.childData.last_name}" id="lastName" name="lastName" @change="${(e: any) => this.lastName = e.target.value}"><br><br>
                <label for="username"> Brugernavn: </label>
                <input type="text" value="${this.childData.username}" id="username" name="username" @change="${(e: any) => this.username = e.target.value}"><br><br>
                <label for="age"> Alder: </label>
                <input type="number" value="${this.childData.age}" id="age" name="age" @change="${(e: any) => this.age = e.target.value}"><br><br>
                <label for="balance"> Saldo: </label>
                <input type="number" value="${this.childData.reward_balance}" ${this.childData.reward_balance} id="balance" name="balance" @change="${(e: any) => this.balance = e.target.value}"><br><br>
            </div>
        `
    }

    deleteJunior() {
        console.log("Delete junior user: ", this.childData.username)
    }

    //TODO: add validation
    detailsAction() {
        if (!this.editMode) {
            this.editMode = true;
        } else {
            //check for changes & valid inputs
            console.log(this.firstName, this.lastName, this.username, this.age, this.balance)

            editChild({id: this.childId, first_name: this.firstName, last_name: this.lastName, username: this.username, age: this.age, balance: this.balance})
                .then((r: ApiResponse) => {
                    console.log(r)
                    this.getChildData().then(() => this.editMode = false)
                })
        }
    }

    getChildData(): Promise<void> {
        return fetchChild(this.childId).then((r: ApiResponse) => {
            if (r.results) {
                this.childData = r.results[0]
            }
        })
    }
}