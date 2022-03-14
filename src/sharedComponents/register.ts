import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost} from "../api/apiUtils";
import {ICustomErrorHandling, InputType} from "./sharedInterfaces";
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
            this.errorMessage = "Password & RepeatedPassword must match!"
            return false;
        }

        if (!this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = "Passwords must be at least 8 characters long!"
            return false;
        }

        if (!this.ageValid) {
            this.errorMessage = "You must be 18 years or older to register a parent account!"
            return false;
        }

        if (!this.emailValid) {
            this.errorMessage = "Please enter an email!"
            return false;
        }

        if (!this.firstNameValid || !this.lastNameValid || !this.ageValid || !this.emailValid || !this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = "All fields are required!"
            return false;
        }

        return true;
    }

    //TODO: validate input & visually show errors
    protected render(): TemplateResult {
        return html `
            <input-element .valid="${this.firstNameValid}" label="Fornavn" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
            <input-element .valid="${this.lastNameValid}" label="Efternavn" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
            
            <input-element .valid="${this.ageValid}" .value="${this.age}" .inputType="${InputType.number}" label="Alder" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
            <input-element .valid="${this.emailValid}" .inputType="${InputType.email}" label="Email" @changeValue="${(e: CustomEvent) => this.email = e.detail}"></input-element>
            
            <input-element .valid="${this.passwordValid}" .inputType="${InputType.password}" label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element .valid="${this.repeatedPasswordValid}" .inputType="${InputType.password}" label="Gentag password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <button-element .action="${() => this.register()}"> Register </button-element>
            <button-element .action="${() => this.showLogin()}"> Go back </button-element>

            <error-message> ${this.errorMessage} </error-message>
        `;
    }

    showLogin() {
        this.dispatchEvent(new CustomEvent("showLogin"))
    }

    register() {
        if (this.validated()) {
            apiPost("register/", {
                firstName: this.firstName,
                surname: this.lastName,
                age: this.age,
                email: this.email,
                password: this.password,
            }).then(r => {
                if (r.success) {
                    this.showLogin()
                } else {
                    if (r.error === "ER_DUP_ENTRY") this.errorMessage = "This email already exists!"
                    else this.errorMessage = r.error
                }
            })
        } else {
            window.alert(this.errorMessage)
        }
    }
}