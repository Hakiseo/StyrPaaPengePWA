var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { html, LitElement } from "lit";
import { router } from "../index";
let ParentIndexPage = class ParentIndexPage extends LitElement {
    connectedCallback() {
        super.connectedCallback();
        //Check and validate token with an api-call to see if we have access to the site
    }
    render() {
        return html `
            <h1> Hello from Parent Index Page! </h1>
            ${this.parentId ? html `<h2> Parent Id: ${this.parentId}</h2>` : ''}
            ${this.renderWishListRedeemSection()}
            ${this.renderTaskApprovalSection()}
            <button> Opgaver </button>
            ${this.renderJuniorUsers()}
            <button @click="${() => router.navigate("/parent/createChild")}"> Opret Junior Konto </button>
        `;
    }
    renderWishListRedeemSection() {
        return html `
            <div> 
                <h3> Indløste ønskelister: </h3> 
            </div>
        `;
    }
    renderTaskApprovalSection() {
        return html `
            <div> 
                <h3> Opgaver til godkendelse: </h3> 
            </div>
        `;
    }
    renderJuniorUsers() {
        return html `
            <div> Junior 1 </div>
            <div> Junior 2 </div>
            <div> Junior 3 </div>
        `;
    }
};
__decorate([
    property({ type: Number })
], ParentIndexPage.prototype, "parentId", void 0);
ParentIndexPage = __decorate([
    customElement("parent-index-page")
], ParentIndexPage);
export { ParentIndexPage };
//# sourceMappingURL=parentIndexPage.js.map