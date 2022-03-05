import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ChildData} from "./parentInterfaces";
import {router} from "../index";

@customElement("child-details")
export class ChildDetails extends LitElement {
    //TODO: Replace with real data
    @property() childData: ChildData = {id: 1, first_name: "test", last_name: "test", username: "tester", age: 12, reward_balance: 1200};
    @property() editMode: boolean = false;

    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() username: string = "";
    @property() age: number = 3;
    @property() balance: number = 0;

    protected render(): TemplateResult {
        // if (!this.childData) return html ` <p> Loading... </p>`
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

    //TODO: when changing username we need to somehow log the child user out?
    detailsAction() {
        if (!this.editMode) {
            this.editMode = true;
        } else {
            //check for changes
            //make post-request to api
            this.editMode = false; //this should be set on success
        }
    }
}