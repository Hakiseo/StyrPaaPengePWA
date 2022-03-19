import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {ApprovedType} from "../parentComponents/parentInterfaces";
import {fetchApprovedTasksParent, fetchApprovedWishesParent} from "../api/parentApiRequests";
import {fetchApprovedWishesChild} from "../api/childApiRequests";
import {IApiResponse, ITasklist, IWishlist} from "./sharedInterfaces";

@customElement("approved-display")
export class ApprovedDisplay extends LitElement {
    @property() approvedType: ApprovedType = ApprovedType.wish;
    @property() parent: boolean = false;
    @property() tasks: ITasklist[] = [];
    @property() wishlists: IWishlist[] = [];

    static styles = [css`
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
    `];

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("approvedType")) {
            switch (this.approvedType) {
                case ApprovedType.task:
                    this.fetchTasks()
                    return;
                case ApprovedType.wish:
                    this.fetchWishLists()
                    return;
            }
        }
    }

    protected render(): TemplateResult {
        switch (this.approvedType) {
            case ApprovedType.task:
                return this.renderApprovedTasks();
            case ApprovedType.wish:
                return this.renderApprovedWishlists();
            default:
                return html ``
        }
    }

    renderApprovedWishlists() {
        return html `
            <h1> Godkendte og lukkede ønskelister: </h1>
            <div class="container">
                ${this.wishlists.length > 0 ? this.wishlists.map(r => {
                    return html `<wish-element .wish="${r}" .parentView="${this.parent}"></wish-element>`
                }) : "Der er ikke godkendt nogle ønsker endnu!"}
            </div>
        `
    }

    fetchWishLists() {
        let wishPromise: Promise<any> = this.parent ? fetchApprovedWishesParent() : fetchApprovedWishesChild();
        wishPromise.then((r: IApiResponse) => {
            if (r.error) window.alert(`Whoops something went wrong (${r.error}) - Please try again`)
            if (r.results) this.wishlists = r.results
        })
    }

    renderApprovedTasks() {
        return html `
            <h1> Godkendte og lukkede opgaver: </h1>
            <div class="container">
                ${this.tasks.length > 0 ? this.tasks.map(r => {
                    return html `<task-element .task="${r}" .parentView="${true}" .parentConfirmMode="${true}"></task-element>`
                }) : "Der er ikke godkendt nogle opgaver endnu! Enten er barnet dovent eller også er du skrap? O.o"}
            </div>
        `
    }

    fetchTasks() {
        fetchApprovedTasksParent().then((r: IApiResponse) => {
            if (r.error) {
                window.alert(`Whoops something went wrong (${r.error}) - Please try again`)
            }
            if (r.results) {
                this.tasks = r.results
            }
        })
    }
}