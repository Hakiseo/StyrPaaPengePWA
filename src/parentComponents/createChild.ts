import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {createJuniorUser} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import {getCurrentUserId} from "../api/apiUtils";
import {router} from "../index";
import "../sharedComponents/buttonElement";
import "../sharedComponents/inputElement";
import "../sharedComponents/errorMessage";

@customElement("create-child")
export class CreateChild extends LitElement implements ICustomErrorHandling {
    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() age: number = 5;
    @property() username: string = "";
    @property() password: string = "";
    @property() repeatedPassword: string = "";
    @property() startBalance: number = 0;

    @property() errorMessage: string = "";

    @property() firstNameValid: boolean = true;
    @property() lastNameValid: boolean = true;
    @property() ageValid: boolean = true;
    @property() usernameValid: boolean = true;
    @property() passwordValid: boolean = true;
    @property() repeatedPasswordValid: boolean = true;
    @property() startBalanceValid: boolean = true;

    static get styles() {
        return css`
        `
    }

    validated() {
        this.firstNameValid = this.firstName.length > 0
        this.lastNameValid = this.lastName.length > 0
        this.ageValid = this.age >= 5
        this.usernameValid = this.username.length > 0
        this.passwordValid = this.password.length >= 3
        this.repeatedPasswordValid = this.repeatedPassword.length >= 3
        this.startBalanceValid = this.startBalance >= 0;

        if (this.password !== this.repeatedPassword) {
            this.errorMessage = "Password & RepeatedPassword must match!"
            return false;
        }

        if (!this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = "Passwords for Juniors must be at least 3 characters long!"
            return false;
        }

        if (!this.ageValid) {
            this.errorMessage = "The child must be at least 5 years old!"
            return false;
        }

        if (!this.startBalanceValid) {
            this.errorMessage = "The starting balance must not be less than 0! (I know you feel like the kids are in your debt but still...)"
            return false;
        }

        if (!this.firstNameValid || !this.lastNameValid || !this.ageValid || !this.usernameValid || !this.passwordValid || !this.repeatedPasswordValid) {
            this.errorMessage = "All fields are required!"
            return false;
        }

        return true;
    }

    protected render(): TemplateResult {
        return html `
            <h1> Opret junior bruger </h1>
            
            <input-element .valid="${this.firstNameValid}" label="Fornavn" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
            <input-element .valid="${this.lastNameValid}" label="Efternavn" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>

            <input-element .valid="${this.ageValid}" .inputType="${InputType.number}" label="Alder" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
            <input-element .valid="${this.usernameValid}" label="Brugernavn" @changeValue="${(e: CustomEvent) => this.username = e.detail}"></input-element>

            <input-element .valid="${this.passwordValid}" .inputType="${InputType.password}" label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element .valid="${this.repeatedPasswordValid}" .inputType="${InputType.password}" label="Gentag password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <input-element .valid="${this.startBalanceValid}" .inputType="${InputType.number}" label="Start Saldo" @changeValue="${(e: CustomEvent) => this.startBalance = e.detail}"></input-element>
            
            <button-element .action="${() => this.createNewJuniorUser()}"> Opret ny Junior-bruger</button-element>
            
            <error-message> ${this.errorMessage} </error-message>
        `;
    }

    createNewJuniorUser() {
        if (this.validated()) {
            createJuniorUser({
                firstName: this.firstName,
                lastName: this.lastName,
                age: this.age,
                username: this.username,
                password: this.password,
                startBalance: this.startBalance,
                parentId: getCurrentUserId(),
            }).then((r: IApiResponse) => {
                if (!r.error) {
                    router.navigate("/parent")
                } else {
                    this.errorMessage = r.error
                }
            })
        } else {
            window.alert(this.errorMessage)
        }
    }
}