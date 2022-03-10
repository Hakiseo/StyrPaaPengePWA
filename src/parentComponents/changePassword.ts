import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import {changePasswordChild, changePasswordParent} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/inputElement"
import "../sharedComponents/buttonElement"

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
            
            <input-element .inputType="${InputType.password}" label="Nyt Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element .inputType="${InputType.password}" label="Gentag nyt password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <div>
                <button-element .action="${() => this.changePassword()}"> Ændre Password </button-element>
                <button-element .action="${() => this.goBack()}"> Annuller </button-element>
            </div>
        `
    }

    renderOldPasswordField(): TemplateResult | void {
        if (!this.parent) return;
        return html `
            <input-element .inputType="${InputType.password}" label="Gammelt Password" @changeValue="${(e: CustomEvent) => this.oldPassword = e.detail}"></input-element>
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