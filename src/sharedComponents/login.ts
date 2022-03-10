import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost, identityTokenName, storageUserId} from "../api/apiUtils";
import {IApiResponse, InputType, UserType} from "./sharedInterfaces";
import {router} from "../index";
import "../sharedComponents/buttonElement"
import "../sharedComponents/inputElement"

@customElement("login-page")
export class Login extends LitElement {
    @property() loginData: string = ""
    @property() password: string = ""

    //TODO: validate input & visually show errors
    protected render(): TemplateResult {
        return html `
            <input-element label="Username/email" @changeValue="${(e: CustomEvent) => this.loginData = e.detail}"></input-element>
            <input-element .inputType="${InputType.password}" label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            
            <button-element .action="${() => this.login()}"> Login </button-element>

            <p style="cursor: pointer; text-decoration: underline" @click="${() => this.showRegister()}"> Register an account </p>
        `;
    }

    showRegister() {
        this.dispatchEvent(new CustomEvent("showRegister"))
    }

    loginStatusChanged(userType: string) {
        this.dispatchEvent(new CustomEvent("loginStatusChanged", {detail: userType}))
    }

    login() {
        if (this.loginData && this.password) {
            apiPost("login/", {
                loginData: this.loginData,
                password: this.password
            }).then((r: IApiResponse) => {
                if (r.error) {
                    window.alert(r.error)
                } else if (r.results == null){
                    window.alert("Wrong Credentials")
                } else {
                    let userId: number = r.results[0].id
                    let userType: any[] = r.results.map(r => r.email)

                    //Determine first and then throw the type with it to the server to set token
                    this.determineUserType(userType, userId)
                }
            })
        } else {
            window.alert("A username/email & password is required!")
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