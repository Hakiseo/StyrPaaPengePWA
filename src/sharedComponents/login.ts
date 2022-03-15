import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost, identityTokenName, storageUserId} from "../api/apiUtils";
import {ButtonType, IApiResponse, ICustomErrorHandling, InputType, UserType} from "./sharedInterfaces";
import {router} from "../index";
import "../sharedComponents/buttonElement"
import "../sharedComponents/inputElement"
import "../sharedComponents/errorMessage"

@customElement("login-page")
export class Login extends LitElement implements ICustomErrorHandling {
    @property() loginData: string = ""
    @property() password: string = ""
    @property() errorMessage: string = ""

    @property() loginDataValid: boolean = true;
    @property() passwordValid: boolean = true;

    static get styles() {
        return css`
            .register {
                cursor: pointer; 
                text-decoration: underline; 
                width: fit-content;
            }
            
            .register:hover {
                color: #af42ff;
            }
        `
    }

    validated() {
        this.loginDataValid = this.loginData.length > 0;
        this.passwordValid = this.password.length > 0;

        let valid = this.loginDataValid && this.passwordValid
        this.errorMessage = valid ? "" : "A username/email & password is required!"
        return valid;
    }

    protected render(): TemplateResult {
        return html `
            <input-element .valid="${this.loginDataValid}" label="Username/email" @changeValue="${(e: CustomEvent) => this.loginData = e.detail}"></input-element>
            <input-element .valid="${this.passwordValid}" .inputType="${InputType.password}" label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.login()}"> Login </button-element>
            <error-message> ${this.errorMessage} </error-message>
            <p class="register" @click="${() => this.showRegister()}"> Register an account </p>
        `;
    }

    showRegister() {
        this.dispatchEvent(new CustomEvent("showRegister"))
    }

    loginStatusChanged(userType: string) {
        this.dispatchEvent(new CustomEvent("loginStatusChanged", {detail: userType}))
    }

    login() {
        if (this.validated()) {
            apiPost("login/", {
                loginData: this.loginData,
                password: this.password
            }).then((r: IApiResponse) => {
                if (r.error) {
                    this.errorMessage = r.error
                    window.alert(r.error)
                } else if (r.results == null){
                    this.errorMessage = "Wrong Credentials!"
                    window.alert("Wrong Credentials!")
                } else {
                    let userId: number = r.results[0].id
                    let userType: any[] = r.results.map(r => r.email)

                    //Determine first and then throw the type with it to the server to set token
                    this.determineUserType(userType, userId)
                }
            })
        } else {
            window.alert(this.errorMessage)
        }
    }

    determineUserType(data: any[], userId: number) {
        let userType = UserType.child;
        if (data[0]) {
            userType = UserType.parent
        }

        apiPost("token", {userId: userId, userType: userType}).then((r: any) => {
            localStorage.setItem(identityTokenName, r.identityToken)
            localStorage.setItem(storageUserId, userId.toString())
        }).then(() => {
            this.loginStatusChanged(userType);
            userType == UserType.parent ? router.navigate("/parent") : router.navigate("/child")
        })
    }
}