import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost} from "../api/apiUtils";
import {InputType} from "./sharedInterfaces";

@customElement("register-page")
export class Register extends LitElement {
    @property() firstName: string = ""
    @property() lastName: string = ""
    @property() age: number = 18 //Standard value
    @property() email: string = ""
    @property() password: string = ""
    @property() repeatedPassword: string = ""

    //TODO: validate input & visually show errors
    protected render(): TemplateResult {
        return html `
            <input-element label="Fornavn" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
            <input-element label="Efternavn" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
            <input-element .inputType="${InputType.number}" label="Alder" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>

            <input-element .inputType="${InputType.email}" label="Email" @changeValue="${(e: CustomEvent) => this.email = e.detail}"></input-element>

            <input-element label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element label="Gentag password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <button-element .action="${() => this.register()}"> Register </button-element>
            <button-element .action="${() => this.showLogin()}"> Go back </button-element>
        `;
    }

    showLogin() {
        this.dispatchEvent(new CustomEvent("showLogin"))
    }

    register() {
        if (this.password !== this.repeatedPassword) {
            window.alert("The inputted passwords does not match!")
            return;
        }
        if (this.email && this.password && this.repeatedPassword) {
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
                    window.alert(r.error)
                }
            })
        } else {
            window.alert("All fields are required!")
        }
    }
}