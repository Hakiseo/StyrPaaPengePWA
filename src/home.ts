import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import "./sharedComponents/login"
import "./sharedComponents/register"
import {router} from "./index";
import {apiPost, getIdentityToken} from "./api/apiUtils";
import {IUserType, IVerifyTokenResponse} from "./sharedComponents/sharedInterfaces";

@customElement('home-element')
export class Home extends LitElement {
    @property() showRegister: boolean = false;

    //Show login & register only

    connectedCallback() {
        super.connectedCallback();
        if (getIdentityToken().length > 0) {
            apiPost("verifyToken", {})
                .then((r: IVerifyTokenResponse) => {
                    if (r.success) {
                        let parent = r.userType === IUserType.parent
                        parent ? router.navigate("/parent") : router.navigate("/child")
                    }
                })
        }
    }

    render(): TemplateResult {
        if (this.showRegister) {
            return html `<register-page @showLogin="${() => this.showRegister = false}"></register-page>`
        }

        return html `
            <login-page @showRegister="${() => this.showRegister = true}" @loginStatusChanged="${(e: any) => this.updateUserStatus(e)}"></login-page>
        `
    }

    updateUserStatus(e: any) {
        this.dispatchEvent(new CustomEvent("updateUserStatus", {detail: e.detail}))
    }
}