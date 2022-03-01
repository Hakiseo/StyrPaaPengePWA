import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import Navigo from "navigo";
import "./childComponents/childIndexPage";
import "./childComponents/wishlistOverviewPage";
import "./parentComponents/parentIndexPage";
import "./childComponents/wishDetail";
import "./home"

export const router = new Navigo('/');

@customElement('index-element')
export class IndexElement extends LitElement {
    get route() {
        return this._route;
    }

    set route(value) {
        this._route = value;
    }

    @property() private _route!: TemplateResult | void;

    @property({type: Number}) count = 0;

    constructor() {
        super();
        router
            .on("/wish-detail/:id", () => {this.route = html`<wish-detail-page></wish-detail-page>`})
            .on("/parent", () => {this.route = html`<parent-index-page></parent-index-page>`})
            .on("/parent/:id", (match: any) => {console.log("Match object from Navigo router: ", match); this.route = html`<parent-index-page .parentId="${match.data.id}"></parent-index-page>`})
            .on("/child", () => {this.route = html`<child-index-page></child-index-page>`})
            .on("/wishlist-overview", () => {this.route = html`<wishlist-overview-page></wishlist-overview-page>`})
            .on("/home", () => {this.route = html`<home-element></home-element>`})
            .on("*", () => {setTimeout(() => this.route = this.render404(), 200)})
        ;

        if (window.location.href == "http://localhost:8000/") {
            router.navigate("/home")
        }

        router.resolve();
    }

    render(): TemplateResult {
        return html `
            ${this.route}
        `
    }

    render404() {
        return html ` 
        <div class="w3-container">
            <h2> 404 - Not found </h2>
            <button class="w3-button w3-blue-gray" @click="${() => router.navigate("/home")}"> Go back to main page </button> 
        </div>
        `
    }
}
