var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Navigo from "navigo";
import "./childComponents/childIndexPage";
import "./childComponents/wishlistOverviewPage";
import "./parentComponents/parentIndexPage";
import "./childComponents/wishDetail";
import "./home";
export const router = new Navigo('/');
let IndexElement = class IndexElement extends LitElement {
    constructor() {
        super();
        this.count = 0;
        router
            .on("/wish-detail/:id", (match) => { this.route = html `<wish-detail-page .wishID="${match.data.id}"></wish-detail-page>`; })
            .on("/parent", () => { this.route = html `<parent-index-page></parent-index-page>`; })
            .on("/parent/:id", (match) => { console.log("Match object from Navigo router: ", match); this.route = html `<parent-index-page .parentId="${match.data.id}"></parent-index-page>`; })
            .on("/child", () => { this.route = html `<child-index-page></child-index-page>`; })
            .on("/wishlist-overview", () => { this.route = html `<wishlist-overview-page></wishlist-overview-page>`; })
            .on("/home", () => { this.route = html `<home-element></home-element>`; })
            .on("*", () => { setTimeout(() => this.route = this.render404(), 200); });
        if (window.location.href == "http://localhost:8000/") {
            router.navigate("/home");
        }
        router.resolve();
    }
    get route() {
        return this._route;
    }
    set route(value) {
        this._route = value;
    }
    render() {
        return html `
            ${this.route}
        `;
    }
    render404() {
        return html ` 
        <div class="w3-container">
            <h2> 404 - Not found </h2>
            <button class="w3-button w3-blue-gray" @click="${() => router.navigate("/home")}"> Go back to main page </button> 
        </div>
        `;
    }
};
__decorate([
    property()
], IndexElement.prototype, "_route", void 0);
__decorate([
    property({ type: Number })
], IndexElement.prototype, "count", void 0);
IndexElement = __decorate([
    customElement('index-element')
], IndexElement);
export { IndexElement };
//# sourceMappingURL=index.js.map