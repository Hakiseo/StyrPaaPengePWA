import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import "../sharedComponents/wishElement"
import {ITasklist} from "./parentInterfaces";
import {IApiResponse} from "../sharedComponents/sharedInterfaces";
import {getCompleteTasklistParent} from "../api/parentApiRequests";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement"
//import "../sharedComponents/errorElement"

@customElement("tasklist-overview-page")
export class TasklistOverviewPage extends LitElement {

    @property() tasklist!: ITasklist[];
    @property({type: String}) errorMessage: string | null = "";

    connectedCallback() {
        super.connectedCallback();
        console.log("Returned to Overview-Page")
        console.log("Wishlist data" , this.tasklist)
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if(_changedProperties.has("tasklist")){
            console.log("Updated tasklist" , this.tasklist)
            if(this.tasklist.length == 0){
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
                console.log("Setting tasklist")
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
        if(!this.tasklist){
            console.log("Connected Callback")
            this.loadTasklist();
        }
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
                <!--<error-message> Error loading tasklist </error-message>-->
            `;
        }else{
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
        }
    }
}
