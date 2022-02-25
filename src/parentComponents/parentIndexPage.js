var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { html, LitElement } from "lit";
let ParentIndexPage = class ParentIndexPage extends LitElement {
    render() {
        return html `
            <h1> Hello from Parent Index Page! </h1>
            ${this.renderSpecificParent()}
        `;
    }
    renderSpecificParent() {
        if (!this.parentId)
            return;
        return html `
            <h1> Hello from Parent Index Page with parent id: ${this.parentId}! </h1>
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