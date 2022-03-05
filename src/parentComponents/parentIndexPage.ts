import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import {router} from "../index";
import "./childCard"

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
            <button> Opgaver </button><br><br>
            
            ${this.renderJuniorUsers()} <br> <br>
            
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
        //Add loop here for all juniors and route on click to user id
        return html `
            <junior-card @click="${() => router.navigate("/parent/childDetails/1")}"></junior-card>
            <junior-card @click="${() => router.navigate("/parent/childDetails/2")}"></junior-card>
            <junior-card @click="${() => router.navigate("/parent/childDetails/3")}"></junior-card>
        `
    }
}