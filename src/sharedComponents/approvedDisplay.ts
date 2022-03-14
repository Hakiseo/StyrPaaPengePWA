import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";
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
            <h1> Approved Wishlists: </h1>
            ${this.wishlists.length > 0 ? this.wishlists.map(r => {
                return html `<wish-element .wish="${r}" .parentView="${true}"></wish-element>`
            }) : "Der er ikke godkendt nogle ønsker endnu! Det syndt for dit barn...."}
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
            <h1> Approved Tasks: </h1>
            ${this.tasks.length > 0 ? this.tasks.map(r => {
                return html `<task-element .task="${r}" .parentView="${true}" .parentConfirmMode="${true}"></task-element>`
            }) : "Der er ikke godkendt nogle opgaver endnu! Enten er barnet dovent eller også er du skrap? O.o"}
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