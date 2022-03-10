import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";

// https://www.w3schools.com/howto/howto_css_contact_chips.asp
@customElement("junior-card")
export class ChildCard extends LitElement {
    @property() firstName: string = "John Doe"
    @property() lastName: string = "John Doe"

    static styles = css `
        .chip {
          display: inline-block;
          padding: 0 25px;
          height: 50px;
          font-size: 16px;
          line-height: 50px;
          border-radius: 25px;
          background-color: #f1f1f1;
          cursor: pointer;
        }
    `

    protected render(): TemplateResult {
        return html `
            <div class="chip">
                ${this.firstName} ${this.lastName}
            </div>
        `;
    }
}