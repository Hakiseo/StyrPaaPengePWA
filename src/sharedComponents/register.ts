import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {registerNewUser} from "../api/apiUtils";
import {ButtonType, ICustomErrorHandling, InputType, ISuccessResponse} from "./sharedInterfaces";
import "../sharedComponents/errorMessage"

@customElement("register-page")
export class Register extends LitElement implements ICustomErrorHandling{
    @property() firstName: string = ""
    @property() lastName: string = ""
    @property() age: number = 18 //Standard value
    @property() email: string = ""
    @property() password: string = ""
    @property() repeatedPassword: string = ""

    @property() firstNameValid: boolean = true;
    @property() lastNameValid: boolean = true;
    @property() ageValid: boolean = true;
    @property() emailValid: boolean = true;
    @property() passwordValid: boolean = true;
    @property() repeatedPasswordValid: boolean = true;

    @property() errorMessage: string = ""

    validated() {
        this.firstNameValid = this.firstName.length > 0
        this.lastNameValid = this.lastName.length > 0
        this.ageValid = this.age >= 18
        this.emailValid = this.email.includes("@")
        this.passwordValid = this.password.length >= 8
        this.repeatedPasswordValid = this.repeatedPassword.length >= 8

        if (this.password !== this.repeatedPassword) {
            this.errorMessage = "indtastet password er ikke ens!"
            this.passwordValid = false;
            this.repeatedPasswordValid = false;
            return false;
        }

        if (!this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = "Password'et skal indeholde mindst 8 tegn!"
            return false;
        }

        if (!this.ageValid) {
            this.errorMessage = "Du skal minimum være 18 år, for at oprette en konto!"
            return false;
        }

        if (!this.emailValid) {
            this.errorMessage = "Indtask email!"
            return false;
        }

        if (!this.firstNameValid || !this.lastNameValid || !this.ageValid || !this.emailValid || !this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = "Alle felter skal udfyldes!"
            return false;
        }

        return true;
    }

    protected render(): TemplateResult {
        return html `
            <input-element .valid="${this.firstNameValid}" label="Fornavn" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
            <input-element .valid="${this.lastNameValid}" label="Efternavn" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
            
            <input-element .valid="${this.ageValid}" .value="${this.age}" .inputType="${InputType.number}" label="Alder" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
            <input-element .valid="${this.emailValid}" .inputType="${InputType.email}" label="Email" @changeValue="${(e: CustomEvent) => this.email = e.detail}"></input-element>
            
            <input-element .valid="${this.passwordValid}" .inputType="${InputType.password}" label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element .valid="${this.repeatedPasswordValid}" .inputType="${InputType.password}" label="Gentag password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => this.showLogin()}"> Tilbage </button-element>
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.register()}"> Registrere </button-element>

            <error-message> ${this.errorMessage} </error-message>
        `;
    }

    showLogin() {
        this.dispatchEvent(new CustomEvent("showLogin"))
    }

    register() {
        if (this.validated()) {
            registerNewUser({
                firstName: this.firstName,
                surname: this.lastName,
                age: this.age,
                email: this.email,
                password: this.password,
            }).then((r: ISuccessResponse) => {
                if (r.error) {
                    if (r.error === "ER_DUP_ENTRY") this.errorMessage = "Email addressen eksisterer allerede!"
                    else this.errorMessage = r.error
                }
                else if (r.success) {
                    this.showLogin()
                } else {
                    this.errorMessage = "Noget gik galt. Reload siden og prøv igen"
                }
            })
        } else {
            window.alert(this.errorMessage)
        }
    }
}