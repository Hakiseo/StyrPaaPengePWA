import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost} from "../api/apiUtils";
import {apiResponse} from "./sharedInterfaces";

@customElement("login-page")
export class Login extends LitElement {
    @property() loginData: string = ""
    @property() password: string = ""

    protected render(): TemplateResult {
        return html `
            <label for="username">Username/email:</label>
            <input type="text" id="username" name="username" @change="${(e: any) => this.loginData = e.target.value}"><br><br>
            
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" @change="${(e: any) => this.password = e.target.value}"><br><br>
            
            <button type="button" @click="${() => this.login()}"> Login </button>

            <p style="cursor: pointer; text-decoration: underline" @click="${() => this.showRegister()}"> Register an account </p>
        `;
    }

    showRegister() {
        this.dispatchEvent(new CustomEvent("showRegister"))
    }

    login() {
        if (this.loginData && this.password) {
            apiPost("login/", {
                loginData: this.loginData,
                password: this.password
            }).then((r: apiResponse) => {
                if (r.error) {
                    window.alert(r.error)
                } else {
                    window.alert("Set cookie and login go to relevant index page - figure out if it's a parent or child")
                    // router.navigate("/child")
                    // router.navigate("/parent")
                }
            })
        } else {
            window.alert("A username/email & password is required!")
        }
    }
}