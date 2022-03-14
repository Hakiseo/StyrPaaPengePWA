import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {ApprovedType} from "../parentComponents/parentInterfaces";

@customElement("approved-display")
export class ApprovedDisplay extends LitElement {
    @property() approvedType: ApprovedType = ApprovedType.wish;
    @property() parent: boolean = false;

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("approvedType")) {
            console.log("Updated approvedType to: ", this.approvedType)
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
            <h2> Parent? ${this.parent} </h2>
        `
    }

    fetchApprovedWishLists() {

    }

    renderApprovedTasks() {
        return html `
            <h1> Approved Tasks: </h1>
            <h2> Parent? ${this.parent} </h2>
        `
    }

    fetchApprovedTasks() {

    }
}