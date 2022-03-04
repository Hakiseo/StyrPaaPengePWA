import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import "./childComponents/childIndexPage";
import "./childComponents/wishlistOverviewPage";
import "./parentComponents/parentIndexPage";
import "./sharedComponents/wishDetail";
import "./childComponents/wishCreatePage";
import "./sharedComponents/taskDetail";
import "./home"
import "./parentComponents/createChild";
import "./home";
import "./sharedComponents/register";
import {apiPost, getIdentityToken} from "./api/apiUtils";
import {UserType, VerifyTokenResponse} from "./sharedComponents/sharedInterfaces"

import Navigo from "navigo";
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

    @property() parent: boolean = false;
    @property() loggedIn: boolean = false;

    //TODO: Make it handle window.history too - currently you can press back and still access pages you shouldn't be able to
    connectedCallback() {
        super.connectedCallback();
        //TODO: Fix this so it actually routes to something else than 404-page when not logged in
        if (window.location.href == "http://localhost:8000/" || window.location.href == "http://localhost:8000") {
            this.routeBackToIndex()
        }
    }

    constructor() {
        super();
        router
            .on("/home", () => {
                if (!this.loggedIn) {
                    this.route = html`
                        <home-element @updateUserStatus="${(e: any) => {
                            this.loggedIn = true;
                            this.parent = e.detail === UserType.parent;
                            alert("CHANGED STATUS ON USER! User is: " + e.detail)
                        }}">
                        </home-element>
                    `
                } else {
                    this.routeBackToIndex()
                }
            })

            .on("/child", () => {
                if (!this.parent && this.loggedIn) {
                    console.log("Child path - child user")
                    this.route = html`<child-index-page></child-index-page>`
                } else {
                    console.log("Child path but parent user")
                    this.routeBackToIndex()
                }
            })

            .on("/task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}"></task-detail-page>`})

            .on("/wishlist-overview", () => {!this.parent && this.loggedIn ? this.route = html`<wishlist-overview-page></wishlist-overview-page>` : this.routeBackToIndex()})
            .on("/wishlist-creating", () => {!this.parent && this.loggedIn ? this.route = html`<wish-create-page></wish-create-page>` : this.routeBackToIndex()})
            .on("/wish-detail/:id", (match: any) => {this.route = html`<wish-detail-page .wishID="${match.data.id}"></wish-detail-page>`})

            .on("/parent", () => {this.parent && this.loggedIn ? this.route = html`<parent-index-page></parent-index-page>` : this.routeBackToIndex()})
            .on("/parent/createChild", () => {this.parent && this.loggedIn ? this.route = html`<create-child></create-child>` : this.routeBackToIndex()})
            .on("/parent/:id", (match: any) => {
                console.log("Match object from Navigo router: ", match);
                this.parent && this.loggedIn ? this.route = html`<parent-index-page .parentId="${match.data.id}"></parent-index-page>` : this.routeBackToIndex()
            })

            .on("*", () => {setTimeout(() => this.route = this.render404(), 200)})
        ;

        //Need this to handle on refresh and still validate routes
        if (getIdentityToken().length > 0) {
            apiPost("verifyToken", {})
                .then((r: VerifyTokenResponse) => {
                    if (r.success) {
                        this.loggedIn = true;
                        this.parent = r.userType === UserType.parent
                    }
                    console.log(r)
                    router.resolve();
                })
        } else {
            console.log("Navigating back to home - No valid token is set")
            router.resolve();
            this.routeBackToIndex()
        }
    }

    render(): TemplateResult {
        return html `
            ${this.route}
            <button @click="${() => this.logout()}"> Log Out </button>
        `
    }

    routeBackToIndex() {
        if (this.loggedIn) {
            this.parent ? router.navigate("/parent") : router.navigate("/child")
            return;
        }
        router.navigate("/home")
    }

    //TODO: Move logout into sidemenu
    logout() {
        localStorage.clear();
        this.loggedIn = false;
        this.routeBackToIndex()
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
