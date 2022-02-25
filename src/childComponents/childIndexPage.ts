import {customElement} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

@customElement("child-index-page")
export class ChildIndexPage extends LitElement {

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Child Index Page! </h1>
        `
    }
}