var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { html, LitElement } from "lit";
import { getTasklist } from "../api/childApiRequests";
import "./taskElement";
//import {property} from "lit/decorators";
let ChildIndexPage = class ChildIndexPage extends LitElement {
    constructor() {
        super();
        this.errorMessage = "";
        getTasklist().then((r) => {
            this.tasklist = r.results;
            this.errorMessage = r.error;
            //this.errorMessage = "r.error" //simulerer at der er en error besked
        });
    }
    render() {
        return html `
            <h1> Hello from Child Index Page! </h1>
            <a href= "/wishlist-overview">Wishlist</a>

            <div>
                ${this.renderTasks()}
            </div>
        `;
    }
    renderTasks() {
        if (this.errorMessage) {
            return html `
                <p> ${this.errorMessage} </p>
                <p> Loading...</p>
            `;
        }
        return html `
            <h1>Opgaver:</h1>
            <section class="container">
                ${this.tasklist.map(task => {
            console.log(task);
            return html `
                    <task-element .task=${task}></task-element>
                `;
        })}
            </section>
        `;
    }
};
__decorate([
    property()
], ChildIndexPage.prototype, "tasklist", void 0);
__decorate([
    property({ type: String })
], ChildIndexPage.prototype, "errorMessage", void 0);
ChildIndexPage = __decorate([
    customElement("child-index-page")
], ChildIndexPage);
export { ChildIndexPage };
//# sourceMappingURL=childIndexPage.js.map