import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import {changePasswordChild, changePasswordParent} from "../api/parentApiRequests";
import {ButtonType, IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/inputElement"
import "../sharedComponents/buttonElement"
import "../sharedComponents/errorMessage"

@customElement("change-password")
export class ChangePassword extends LitElement implements ICustomErrorHandling{
    @property() parent: boolean = false;
    @property() id: string = ""

    @property() oldPassword: string = ""
    @property() password: string = ""
    @property() repeatedPassword: string = ""

    @property() oldPasswordValid: boolean = true;
    @property() passwordValid: boolean = true;
    @property() repeatedPasswordValid: boolean = true;

    @property() errorMessage: string = "";

    //"All fields are required and password and repeated password must match!"

    validated() {
        if (this.parent) {
            this.oldPasswordValid = this.oldPassword.length > 0 && this.oldPassword.length < 255 //Just need to not be empty if a user was created before our requirements
            this.passwordValid = this.password.length >= 8 && this.password.length < 255
            this.repeatedPasswordValid = this.repeatedPassword.length >= 8 && this.repeatedPassword.length < 255
        } else {
            this.passwordValid = this.password.length >= 3 && this.password.length < 255
            this.repeatedPasswordValid = this.repeatedPassword.length >= 3 && this.repeatedPassword.length < 255
        }

        if (this.password !== this.repeatedPassword) {
            this.errorMessage = "indtastet password er ikke ens!"
            this.passwordValid = false;
            this.repeatedPasswordValid = false;
            return false;
        }

        if (!this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = `Password'et skal indeholde mindst ${this.parent ? 8 : 3} tegn!`
            return false;
        }

        if (this.parent && !this.oldPasswordValid) {
            this.errorMessage = "Oops seems like you forgot to enter your old password!"
            return false;
        }

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

    protected render(): TemplateResult {
        return html`
            
            ${this.renderOldPasswordField()}
            
            <input-element .valid="${this.passwordValid}" .inputType="${InputType.password}" label="Nyt Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element .valid="${this.repeatedPasswordValid}" .inputType="${InputType.password}" label="Gentag nyt password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <div>
                <button-element .buttonType="${ButtonType.navigate}" .action="${() => this.goBack()}"> Annullere </button-element>
                <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.changePassword()}"> ??ndre Password </button-element>
            </div>
            <error-message> ${this.errorMessage} </error-message>
        `
    }

    renderOldPasswordField(): TemplateResult | void {
        if (!this.parent) return;
        return html `
            <input-element .valid="${this.oldPasswordValid}" .inputType="${InputType.password}" label="Gammelt Password" @changeValue="${(e: CustomEvent) => this.oldPassword = e.detail}"></input-element>
        `
    }

    changePassword() {
        if (this.validated() && this.parent) {
            changePasswordParent({id: this.id, newPassword: this.password, oldPassword: this.oldPassword})
                .then((r: IApiResponse) => {
                    console.log("PARENT: ", r)
                    if (!r.error) {
                        this.goBack()
                    } else {
                        if (r.error === "Invalid old password!") this.errorMessage = "Det gamle password er ikke korrekt!"
                        else this.errorMessage = r.error;
                    }
                })
            return;
        }

        if (this.validated() && !this.parent) {
            changePasswordChild({id: this.id, newPassword: this.password})
                .then((r: IApiResponse) => {
                    console.log("CHILD: ", r)
                    if (!r.error) {
                        this.goBack()
                    } else {
                        this.errorMessage = r.error;
                    }
                })
            return;
        }

        alert(this.errorMessage)
    }

    goBack() {
        let destination = `/parent/childDetails/${this.id}`
        if (this.parent) {
            destination = "/parent/details"
        }
        router.navigate(destination)
    }
}