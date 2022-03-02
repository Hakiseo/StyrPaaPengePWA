import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import {router} from "./index";
import {getAllParent, postParent} from "./api/parentApiRequests";
import {getAllChildren} from "./api/childApiRequests";
import "./sharedComponents/login"
import "./sharedComponents/register"

@customElement('home-element')
export class Home extends LitElement {
    @property() showRegister: boolean = false;

    //Show login & register only

    render(): TemplateResult {
        return html `
            <h1>AMAZinG Retards!!!</h1>
            <button @click="${() => router.navigate("parent")}"> Go To Parent index </button>
            <button @click="${() => router.navigate("parent/1")}"> Go To Parent 1 index </button>
            <button @click="${() => router.navigate("child")}"> Go To Child index </button>
            <button @click="${() => getAllChildren().then(r => console.log(r))}"> Get Children </button>
            <button @click="${() => getAllParent().then(r => console.log(r))}"> Get Parents </button>
            <button @click="${() => postParent()}"> Post test parent </button>
            <hr>
            ${this.renderHomeContent()}
        `;
    }

    renderHomeContent() {
        if (this.showRegister) {
            return html `<register-page @showLogin="${() => this.showRegister = false}"></register-page>`
        }

        return html `
            <login-page @showRegister="${() => this.showRegister = true}"></login-page>
        `
    }
}