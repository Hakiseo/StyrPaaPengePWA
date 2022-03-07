import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import Navigo from "navigo";

import "./parentComponents/tasklistOverviewPage";
import "./parentComponents/parentIndexPage";
import "./parentComponents/taskCreatePage";
import "./parentComponents/createChild";

import "./childComponents/wishlistOverviewPage";
import "./childComponents/childIndexPage";
import "./childComponents/wishCreatePage";

import "./sharedComponents/wishDetail";
import "./sharedComponents/taskDetail";
import "./sharedComponents/register";

import "./home";

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
            .on("/parent-wish-detail/:id", (match: any) => {this.route = html`<wish-detail-page .wishID="${match.data.id}" .parentView="${true}"></wish-detail-page>`})
            .on("/child-wish-detail/:id", (match: any) => {this.route = html`<wish-detail-page .wishID="${match.data.id}" .parentView="${false}"></wish-detail-page>`})

            .on("/parentConfirm-task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${true}" .parentConfirmMode="${true}"></task-detail-page>`})
            .on("/parent-task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${true}"></task-detail-page>`})
            .on("/child-task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${false}"></task-detail-page>`})


            .on("/child", () => {this.route = html`<child-index-page></child-index-page>`})

            .on("/tasklist-overview", () => {this.route = html`<tasklist-overview-page></tasklist-overview-page>`})

            .on("/wishlist-overview", () => {this.route = html`<wishlist-overview-page></wishlist-overview-page>`})
            .on("/wishlist-creating", () => {this.route = html`<wish-create-page></wish-create-page>`})
            .on("/task-creating", () => {this.route = html`<task-create-page></task-create-page>`})

            .on("/parent", () => {this.route = html`<parent-index-page></parent-index-page>`})
            .on("/parent/createChild", () => {this.route = html`<create-child></create-child>`})
            .on("/parent/:id", (match: any) => {console.log("Match object from Navigo router: ", match); this.route = html`<parent-index-page .parentId="${match.data.id}"></parent-index-page>`})
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
