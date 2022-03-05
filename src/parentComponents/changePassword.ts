import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {router} from "../index";

@customElement("change-password")
export class ChangePassword extends LitElement {
    @property() parent: boolean = false;
    @property() id: string = ""

    @property() oldPassword: string = ""
    @property() password: string = ""
    @property() repeatedPassword: string = ""

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        console.log(`Parent: ${this.parent} & Id: ${this.id}`)
    }

    protected render(): TemplateResult {
        return html`
            
            ${this.renderOldPasswordField()}

            <label for="password"> Nyt password: </label>
            <input type="password" id="password" name="password" @change="${(e: any) => this.password = e.target.value}"><br><br>

            <label for="repeatedPassword"> Gentag nyt password:</label>
            <input type="password" id="repeatedPassword" name="repeatedPassword" @change="${(e: any) => this.repeatedPassword = e.target.value}"><br><br>
            
            <div>
                <button @click="${() => this.changePassword()}"> Ændre Password </button>
                <button @click="${() => this.goBack()}"> Annuller </button>
            </div>
        `
    }

    renderOldPasswordField(): TemplateResult | void {
        if (!this.parent) return;
        return html `
            <label for="oldPassword"> Gammelt password: </label>
            <input type="password" id="oldPassword" name="oldPassword" @change="${(e: any) => this.oldPassword = e.target.value}"><br><br>
        `
    }

    changePassword() {
        if (this.oldPassword && (this.password === this.repeatedPassword)) {
            console.log("DO request")
            return;
        }
        alert("All fields are required and password and repeated password must match!")
    }

    goBack() {
        let destination = `/parent/childDetails/${this.id}`
        if (this.parent) {
            destination = "/parent/details"
        }
        router.navigate(destination)
    }
}