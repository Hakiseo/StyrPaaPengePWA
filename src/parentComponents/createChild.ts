import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {createJuniorUser} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import {getCurrentUserId} from "../api/apiUtils";
import {router} from "../index";
import "../sharedComponents/buttonElement";
import "../sharedComponents/inputElement";

@customElement("create-child")
export class CreateChild extends LitElement implements ICustomErrorHandling {
    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() age: number = 3;
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

        if (this.firstNameValid) {
            console.log("VALID")
            return true;
        }
        this.errorMessage = "All fields are required!"
        console.log("INVALID")
        return false
    }

    //TODO: validate input & visually show errors
    protected render(): TemplateResult {
        return html `
            <h1> Opret junior bruger </h1>
            
            <input-element .valid="${this.firstNameValid}" label="Fornavn" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
            <input-element label="Efternavn" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>

            <input-element .inputType="${InputType.number}" label="Alder" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
            <input-element label="Brugernavn" @changeValue="${(e: CustomEvent) => this.username = e.detail}"></input-element>

            <input-element label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element label="Gentag password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <input-element .inputType="${InputType.number}" label="Start Saldo" @changeValue="${(e: CustomEvent) => this.startBalance = e.detail}"></input-element>
            
            <button-element .action="${() => this.createNewJuniorUser()}"> Opret ny Junior-bruger</button-element>
        `;
    }

    createNewJuniorUser() {
        if (this.password !== this.repeatedPassword) {
            window.alert("The inputted passwords does not match!")
            return;
        }
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
                    //TODO: visually show errors
                }
            })
        } else {
            window.alert(this.errorMessage)
        }
    }
}