import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import "./parentComponents/tasklistOverviewPage";
import "./parentComponents/parentIndexPage";
import "./parentComponents/taskCreatePage";
import "./parentComponents/createChild";

import "./childComponents/wishlistOverviewPage";
import "./childComponents/childIndexPage";
import "./childComponents/wishCreatePage";

import "./sharedComponents/wishDetail";
import "./sharedComponents/taskDetail";
import "./parentComponents/childDetails";
import "./parentComponents/parentDetails";
import "./parentComponents/changePassword";
import "./sharedComponents/register";
import "./home";

import {apiFetch, apiPost, getIdentityToken} from "./api/apiUtils";
import {UserType, VerifyTokenResponse} from "./sharedComponents/sharedInterfaces"
import {ChildData, MinimalChildrenData} from "./parentComponents/parentInterfaces";

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

    @property() childData!: ChildData;
    @property() minimalChildrenData: MinimalChildrenData[] = [];

    connectedCallback() {
        super.connectedCallback();
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
                    this.route = html`<child-index-page></child-index-page>`
                } else {
                    this.routeBackToIndex()
                }
            })
            .on("/parent-wish-detail/:id", (match: any) => {this.route = html`<wish-detail-page .wishID="${match.data.id}" .parentView="${true}"></wish-detail-page>`})
            .on("/child-wish-detail/:id", (match: any) => {this.route = html`<wish-detail-page .wishID="${match.data.id}" .parentView="${false}"></wish-detail-page>`})

            .on("/parentConfirm-task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${true}" .parentConfirmMode="${true}"></task-detail-page>`})
            .on("/parent-task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${true}"></task-detail-page>`})
            .on("/child-task-detail/:id", (match: any) => {this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${false}"></task-detail-page>`})


            .on("/child", () => {this.route = html`<child-index-page></child-index-page>`})

            .on("/tasklist-overview", () => {this.route = html`<tasklist-overview-page></tasklist-overview-page>`})

            .on("/wishlist-overview", () => {!this.parent && this.loggedIn ? this.route = html`<wishlist-overview-page></wishlist-overview-page>` : this.routeBackToIndex()})
            .on("/wishlist-creating", () => {!this.parent && this.loggedIn ? this.route = html`<wish-create-page></wish-create-page>` : this.routeBackToIndex()})
            .on("/wish-detail/:id", (match: any) => {this.route = html`<wish-detail-page .wishID="${match.data.id}"></wish-detail-page>`})
            .on("/wishlist-overview", () => {this.route = html`<wishlist-overview-page></wishlist-overview-page>`})
            .on("/wishlist-creating", () => {this.route = html`<wish-create-page></wish-create-page>`})
            .on("/task-creating", () => {this.route = html`<task-create-page></task-create-page>`})

            .on("/parent", () => {
                if (this.parent && this.loggedIn) {
                    this.route = html`
                        <parent-index-page 
                            @indexEmitMinimalChildrenData="${(e:any) => this.minimalChildrenData = e.detail}" 
                            @indexEmitChildData="${(e: any) => this.childData = e.detail}"
                        ></parent-index-page>`
                } else {
                    this.routeBackToIndex()
                }
            })
            .on("/parent/createChild", () => {this.parent && this.loggedIn ? this.route = html`<create-child></create-child>` : this.routeBackToIndex()})
            .on("/parent/details", () => {this.parent && this.loggedIn ? this.route = html`<parent-details></parent-details>` : this.routeBackToIndex()})
            .on("/parent/details/changePassword", () => {this.parent && this.loggedIn ? this.route = html`<change-password .parent="${true}"></change-password>` : this.routeBackToIndex()})
            .on("/parent/childDetails/:id", (match: any) => {this.parent && this.loggedIn ? this.route = html`<child-details .childId="${match.data.id}" .childData="${this.childData}"></child-details>` : this.routeBackToIndex()})
            .on("/parent/childDetails/:id/changePassword", (match: any) => {this.parent && this.loggedIn ? this.route = html`<change-password .id="${match.data.id}" .parent="${false}"></change-password>` : this.routeBackToIndex()})
            .on("/parent/:id", (match: any) => {
                console.log("Match object from Navigo router: ", match);
                this.parent && this.loggedIn ? this.route = html`<parent-index-page .parentId="${match.data.id}"></parent-index-page>` : this.routeBackToIndex()
            })

            .on("*", () => this.route = this.render404())
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
            ${this.renderFutureSideMenu()}
            <hr>
            ${this.route}
            <hr>
            <button @click="${() => this.test()}"> test to fail post (Posting to child api path when parent) </button>
            <button @click="${() => this.test2()}"> test to fail get (Getting at child api path when parent) </button>
        `
    }

    routeBackToIndex() {
        if (this.loggedIn) {
            this.parent ? router.navigate("/parent") : router.navigate("/child")
            return;
        }
        router.navigate("/home")
    }

    renderFutureSideMenu() {
        return html `
            <button @click="${() => router.navigate("/parent/details")}"> Egen detalje side (Forælder) </button>
            <button @click="${() => router.navigate("/home")}"> index </button>
            <button @click="${() => this.logout()}"> Log Out </button>
        `
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
            <button class="w3-button w3-blue-gray" @click="${() => this.routeBackToIndex()}"> Go back to main page </button> 
        </div>
        `
    }

    //TODO: Delete after testing
    //Expect test to fail - Accessing child routes from Parent user
    test() {
        apiPost("child/test", {})
    }

    //TODO: Delete after testing
    test2() {
        apiFetch("child/test")
    }
}
