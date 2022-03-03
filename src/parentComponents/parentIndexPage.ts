import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import {router} from "../index";

@customElement("parent-index-page")
export class ParentIndexPage extends LitElement {
    @property({type: Number}) parentId!: number;

    connectedCallback() {
        super.connectedCallback();
        //Check and validate token with an api-call to see if we have access to the site
    }

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Parent Index Page! </h1>
            ${this.parentId ? html`<h2> Parent Id: ${this.parentId}</h2>` : ''}
            ${this.renderWishListRedeemSection()}
            ${this.renderTaskApprovalSection()}
            <button> Opgaver </button>
            ${this.renderJuniorUsers()}
            <button @click="${() => router.navigate("/parent/createChild")}"> Opret Junior Konto </button>
        `
    }

    renderWishListRedeemSection(): TemplateResult | void {
        return html `
            <div> 
                <h3> Indløste ønskelister: </h3> 
            </div>
        `
    }

    renderTaskApprovalSection(): TemplateResult | void {
        return html `
            <div> 
                <h3> Opgaver til godkendelse: </h3> 
            </div>
        `
    }

    renderJuniorUsers() {
        return html `
            <div> Junior 1 </div>
            <div> Junior 2 </div>
            <div> Junior 3 </div>
        `
    }
}