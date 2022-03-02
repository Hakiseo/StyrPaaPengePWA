import {customElement,property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import {ITasklist} from "./childInterfaces";
import {getTasklist} from "../api/childApiRequests";
import {apiResponse} from "../sharedComponents/sharedInterfaces";
import "./taskElement"
//import {property} from "lit/decorators";

@customElement("child-index-page")
export class ChildIndexPage extends LitElement {

    @property() tasklist!: ITasklist[];
    @property({type: String}) errorMessage: string | null = "";

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Child Index Page! </h1>
            <a href= "/wishlist-overview">Wishlist</a>

            <div>
                ${this.renderTasks()}
            </div>
        `
    }

    constructor() {
        super();
        getTasklist().then((r : apiResponse) =>{
            this.tasklist = r.results
            this.errorMessage = r.error
            //this.errorMessage = "r.error" //simulerer at der er en error besked
        })
    }

    private renderTasks(){
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
                    console.log(task)
                    return html `
                    <task-element .task=${task}></task-element>
                `
            })}
            </section>
        `;
    }
}