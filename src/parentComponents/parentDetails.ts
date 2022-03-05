import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ParentData} from "./parentInterfaces";
import {router} from "../index";

@customElement("parent-details")
export class ParentDetails extends LitElement {
    //TODO: Replace with real data
    @property() parentData: ParentData = {id: 1, first_name: "test", last_name: "test", email: "tester@tester", age: 12};
    @property() editMode: boolean = false;

    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() email: string = "";
    @property() age: number = 3;
    @property() balance: number = 0;

    protected render(): TemplateResult {
        // if (!this.childData) return html ` <p> Loading... </p>`
        return html `
            ${this.editMode ? this.renderEdit() : this.renderView()}
            <div>
                <button @click="${() => this.deleteParent()}"> Slet </button>
                <button @click="${() => router.navigate(`/parent/details/changePassword`)}"> Ændre Password </button>
                <button @click="${() => this.detailsAction()}"> ${this.editMode ? "Gem" : "Rediger"} </button>
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