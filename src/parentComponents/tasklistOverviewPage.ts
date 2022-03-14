import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import "../sharedComponents/wishElement"
import {ITasklist} from "./parentInterfaces";
import {IApiResponse} from "../sharedComponents/sharedInterfaces";
import {getCompleteTasklistParent} from "../api/parentApiRequests";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement"
import "../sharedComponents/errorMessage"

@customElement("tasklist-overview-page")
export class TasklistOverviewPage extends LitElement {

    @property() tasklist!: ITasklist[];
    @property({type: String}) errorMessage: string | null = "";

    connectedCallback() {
        super.connectedCallback();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if(_changedProperties.has("tasklist")){
            if(!this.tasklist){
                this.loadTasklist();
            }
        }
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    loadTasklist(){
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

    protected render(): TemplateResult {
        if (!this.tasklist) return html `Loading ...`;
        return html `
            <div>
                ${this.renderTasks()}
            </div>
        `
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
        this.loadTasklist();
    }

    goBack(){
        router.navigate("/parent")
    }

    createTaskList(){
        router.navigate("/task-creating")
    }

    private renderTasks(){
        if(!this.tasklist){
            return html `
                <error-message> Error loading tasklist </error-message>
            `;
        }else{
            return html `
                <h1>Opgaver:</h1>
                <button-element .action=${() => this.goBack()}>Tilbage</button-element>
                <button-element .action=${() => this.createTaskList()}>Opret Opgave</button-element>
                <section class="container">
                    ${this.tasklist.map(task => {
                        return html `
                            <task-element .task=${task} .parentView="${true}"></task-element>
                        `
                    })}
                </section>
            `;
        }
    }
}
