import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

@customElement("parent-index-page")
export class ParentIndexPage extends LitElement {
    @property({type: Number}) parentId!: number;

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Parent Index Page! </h1>
            ${this.renderSpecificParent()}
        `
    }

    renderSpecificParent(): TemplateResult | void {
        if (!this.parentId) return;
        return html `
            <h1> Hello from Parent Index Page with parent id: ${this.parentId}! </h1>
        `
    }
}