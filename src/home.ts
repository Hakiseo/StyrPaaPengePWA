import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import "./sharedComponents/login"
import "./sharedComponents/register"
import {router} from "./index";
import {getIdentityToken, verifyToken} from "./api/apiUtils";
import {UserType, IVerifyTokenResponse} from "./sharedComponents/sharedInterfaces";

@customElement('home-element')
export class Home extends LitElement {
    @property() showRegister: boolean = false;

    connectedCallback() {
        super.connectedCallback();
        if (getIdentityToken().length > 0) {
            verifyToken().then((r: IVerifyTokenResponse) => {
                    if (r.success) {
                        let parent = r.userType === UserType.parent
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