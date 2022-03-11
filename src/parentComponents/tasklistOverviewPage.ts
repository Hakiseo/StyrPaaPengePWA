import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import "../sharedComponents/wishElement"
import {ITasklist} from "./parentInterfaces";
import {IApiResponse} from "../sharedComponents/sharedInterfaces";
import {getCompleteTasklistParent} from "../api/parentApiRequests";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement"

@customElement("tasklist-overview-page")
export class TasklistOverviewPage extends LitElement {

    @property() tasklist!: ITasklist[];
    @property({type: String}) errorMessage: string | null = "";

    protected render(): TemplateResult {
        if (!this.tasklist) return html `Loading ...`;
        return html `
            <div>
                ${this.renderTasks()}
            </div>
        `
    }

    displayError(){
        window.alert(this.errorMessage)
    }

    static styles = [css`
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
    `];

    constructor() {
        super();
        getCompleteTasklistParent(getCurrentUserId()).then((r : IApiResponse) =>{
            if (r.results !== null) {
                this.tasklist = r.results
            }
            if(r.error){
                this.errorMessage = "Error loading task data..."
                this.displayError()
            }
        })
    }

    goBack(){
        router.navigate("/parent")
    }

    createTaskList(){
        router.navigate("/task-creating")
    }

    private renderTasks(){
        if (this.errorMessage) {
            return html `
                <p> ${this.errorMessage} </p>
                <p> Please try again or please go back to main page </p>
            `;
        }
        if(this.tasklist){
            return html `
                <h1>Opgaver:</h1>
                <button-element .action=${() => this.goBack()}>Tilbage</button-element>
                <button-element .action=${() => this.createTaskList()}>Opret Opgave</button-element>

                <section class="container">
                    ${this.tasklist.map(task => {
                console.log(task)
                return html `
                    <task-element .task=${task} .parentView="${true}"></task-element>
                `
            })}
                </section>
            `;
        }else{
            return html `
                <p> Error loading Tasklist...</p>
            `;
        }
    }
}
