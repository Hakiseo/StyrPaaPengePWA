import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost} from "../api/apiUtils";

@customElement("register-page")
export class Register extends LitElement {
    @property() firstName: string = ""
    @property() surname: string = ""
    @property() age: number = 18 //Standard value
    @property() email: string = ""
    @property() password: string = ""
    @property() repeatedPassword: string = ""

    protected render(): TemplateResult {
        return html `
            <label for="firstname"> Fornavn: </label>
            <input type="text" id="firstname" name="firstname" @change="${(e: any) => this.firstName = e.target.value}"><br><br>

            <label for="surname"> Efternavn: </label>
            <input type="text" id="surname" name="surname" @change="${(e: any) => this.surname = e.target.value}"><br><br>

            <label for="age"> Alder: </label>
            <input type="number" id="age" name="age" value="${this.age}" @change="${(e: any) => this.age = e.target.value}"><br><br>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" @change="${(e: any) => this.email = e.target.value}"><br><br>
            
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" @change="${(e: any) => this.password = e.target.value}"><br><br>
            
            <label for="repeatedPassword">Repeat Password:</label>
            <input type="password" id="repeatedPassword" name="repeatedPassword" @change="${(e: any) => this.repeatedPassword = e.target.value}"><br><br>
            
            <button type="button" @click="${() => this.register()}"> Register </button>
            <button type="button" @click="${() => this.showLogin()}"> Go back </button>
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
                surname: this.surname,
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