import {customElement} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

@customElement("login-page")
export class LoginPage extends LitElement {

    protected render(): TemplateResult {
        return html `
            <h1> Hello Login Page! </h1>
        `
    }
}