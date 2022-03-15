import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {IChildData} from "./parentInterfaces";

// https://www.w3schools.com/howto/howto_css_contact_chips.asp
@customElement("junior-card")
export class ChildCard extends LitElement {
    @property() data!: IChildData

    static styles = css `        
        .card {
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            padding: 2px 16px;
            border-radius: 15px;
            background-color: #333533;
            color: #ffffff;
            margin: 10px;
            width: fit-content;
        }
        
        .card:hover {
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }
    `

    protected render(): TemplateResult | void {
        if (!this.data) return;
        return html `
            <div class="card">
                <p> Navn: ${this.data.first_name} ${this.data.last_name} </p>
                <p> Brugernavn: ${this.data.username} </p>
                <p> Saldo: ${this.data.reward_balance} </p>
            </div>
        `;
    }
}