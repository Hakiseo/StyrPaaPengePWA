import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {apiPost, identityTokenName, storageUserId} from "../api/apiUtils";
import {IApiResponse, UserType} from "./sharedInterfaces";
import {router} from "../index";

@customElement("login-page")
export class Login extends LitElement {
    @property() loginData: string = ""
    @property() password: string = ""

    //TODO: validate input & visually show errors
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