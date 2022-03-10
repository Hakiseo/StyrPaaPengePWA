import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import {changePasswordChild, changePasswordParent} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling} from "../sharedComponents/sharedInterfaces";

@customElement("change-password")
export class ChangePassword extends LitElement implements ICustomErrorHandling{
    @property() parent: boolean = false;
    @property() id: string = ""

    @property() oldPassword: string = ""
    @property() password: string = ""
    @property() repeatedPassword: string = ""

    @property() errorMessage: string = "";

    validated() {
        return true;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.parent) this.id = getCurrentUserId()
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("parent") || _changedProperties.has("id")) {
            console.log(`Parent: ${this.parent} & Id: ${this.id}`)
        }
    }

    //TODO: validate input & visually show errors
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
        if (this.oldPassword && this.password && this.repeatedPassword && (this.password === this.repeatedPassword)) {
            changePasswordParent({id: this.id, newPassword: this.password, oldPassword: this.oldPassword})
                .then((r: IApiResponse) => {
                    console.log("PARENT: ", r)
                    if (!r.error) {
                        this.goBack()
                    } else {
                        //TODO: Handle error
                    }
                })
            return;
        }
        if (this.password && this.repeatedPassword && (this.password === this.repeatedPassword)) {
            changePasswordChild({id: this.id, newPassword: this.password})
                .then((r: IApiResponse) => {
                    console.log("CHILD: ", r)
                    if (!r.error) {
                        this.goBack()
                    } else {
                        //TODO: Handle error
                    }
                })
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