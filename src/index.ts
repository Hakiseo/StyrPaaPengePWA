import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import "./parentComponents/tasklistOverviewPage"
import "./parentComponents/parentIndexPage"
import "./parentComponents/taskCreatePage"
import "./parentComponents/createChild"
import "./parentComponents/childDetails"
import "./parentComponents/parentDetails"
import "./parentComponents/changePassword"

import "./childComponents/wishlistOverviewPage"
import "./childComponents/childIndexPage"
import "./childComponents/wishCreatePage"

import "./sharedComponents/wishDetail"
import "./sharedComponents/taskDetail"
import "./sharedComponents/register"
import "./sharedComponents/sideMenu"
import "./sharedComponents/buttonElement"
import "./sharedComponents/approvedDisplay"
import "./home"

import {getIdentityToken, verifyToken} from "./api/apiUtils";
import {UserType, IVerifyTokenResponse, ButtonType} from "./sharedComponents/sharedInterfaces"
import {ApprovedType, IChildData, IMinimalChildrenData} from "./parentComponents/parentInterfaces";

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

    @property() childData!: IChildData;
    @property() minimalChildrenData: IMinimalChildrenData[] = [];

    connectedCallback() {
        super.connectedCallback();
        if (window.location.href == "http://localhost:8000/" || window.location.href == "http://localhost:8000" || window.location.href == "https://localhost:8000" || window.location.href == "https://localhost:8000/") {
            this.routeBackToIndex()
        }
        if (window.location.href == "https://xn--styrppenge-55a.dk/" || window.location.href == "https://xn--styrppenge-55a.dk") {
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
            .on("/parent-wish-detail/:id", (match: any) => {this.parent && this.loggedIn ? this.route = html`<wish-detail-page .wishID="${match.data.id}" .parentView="${true}"></wish-detail-page>` : this.routeBackToIndex()})
            .on("/child-wish-detail/:id", (match: any) => {!this.parent && this.loggedIn ? this.route = html`<wish-detail-page .wishID="${match.data.id}" .parentView="${false}"></wish-detail-page>` : this.routeBackToIndex()})

            .on("/parentConfirm-task-detail/:id", (match: any) => {this.parent && this.loggedIn ? this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${true}" .parentConfirmMode="${true}"></task-detail-page>` : this.routeBackToIndex()})
            .on("/parent-task-detail/:id", (match: any) => {this.parent && this.loggedIn ? this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${true}"></task-detail-page>` : this.routeBackToIndex()})
            .on("/child-task-detail/:id", (match: any) => {!this.parent && this.loggedIn ? this.route = html`<task-detail-page .taskID="${match.data.id}" .parentView="${false}"></task-detail-page>` : this.routeBackToIndex()})

            .on("/approvedWishlists", () => {!this.parent && this.loggedIn ? this.route = html`<approved-display .approvedType="${ApprovedType.wish}" .parent="${this.parent}"></approved-display>` : this.routeBackToIndex()})
            .on("/tasklist-overview", () => {this.parent && this.loggedIn ? this.route = html`<tasklist-overview-page></tasklist-overview-page>` : this.routeBackToIndex()})
            .on("/wishlist-overview", () => {!this.parent && this.loggedIn ? this.route = html`<wishlist-overview-page></wishlist-overview-page>` : this.routeBackToIndex()})
            .on("/wishlist-creating", () => {!this.parent && this.loggedIn ? this.route = html`<wish-create-page></wish-create-page>` : this.routeBackToIndex()})
            .on("/wish-detail/:id", (match: any) => {!this.parent && this.loggedIn ? this.route = html`<wish-detail-page .wishID="${match.data.id}"></wish-detail-page>` : this.routeBackToIndex()})
            .on("/task-creating", () => {this.parent && this.loggedIn ? this.route = html`<task-create-page .minChildData="${this.minimalChildrenData}"></task-create-page>` : this.routeBackToIndex()})

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
            .on("/parent/approvedTasks", () => {this.parent && this.loggedIn ? this.route = html`<approved-display .approvedType="${ApprovedType.task}" .parent="${this.parent}"></approved-display>` : this.routeBackToIndex()})
            .on("/parent/approvedWishLists", () => {this.parent && this.loggedIn ? this.route = html`<approved-display .approvedType="${ApprovedType.wish}" .parent="${this.parent}"></approved-display>` : this.routeBackToIndex()})
            .on("/parent/createChild", () => {this.parent && this.loggedIn ? this.route = html`<create-child></create-child>` : this.routeBackToIndex()})
            .on("/parent/details", () => {this.parent && this.loggedIn ? this.route = html`<parent-details @logout="${() => this.logout()}"></parent-details>` : this.routeBackToIndex()})
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
            verifyToken()
                .then((r: IVerifyTokenResponse) => {
                    if (r.success) {
                        console.log(r)
                        this.loggedIn = true;
                        this.parent = r.userType === UserType.parent
                        router.resolve();
                    } else {
                        console.log(r)
                        this.loggedIn = false;
                        router.resolve();
                        this.routeBackToIndex()
                    }
                })
        } else {
            console.log("Navigating back to home - No valid token is set")
            router.resolve();
            this.routeBackToIndex()
        }
    }

    render(): TemplateResult {
        return html `
            <side-menu .loggedIn="${this.loggedIn}" .parentUser="${this.parent}" @logout="${() => this.logout()}"></side-menu>
            ${this.route}
        `
    }

    routeBackToIndex() {
        if (this.loggedIn) {
            this.parent ? router.navigate("/parent") : router.navigate("/child")
            return;
        }
        router.navigate("/home")
    }

    logout() {
        localStorage.clear();
        this.loggedIn = false;
        this.routeBackToIndex()
    }

    render404() {
        return html ` 
        <div>
            <h2> 404 - Not found </h2>
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => this.routeBackToIndex()}"> Go back to main page </button-element> 
        </div>
        `
    }
}
