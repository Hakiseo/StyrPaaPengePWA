import {customElement} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

@customElement("child-index-page")
export class ChildIndexPage extends LitElement {

    connectedCallback() {
        super.connectedCallback();
        //Check and validate token with an api-call to see if we have access to the site
    }

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Child Index Page! </h1>
        `
    }
}