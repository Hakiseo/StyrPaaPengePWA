import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import "../sharedComponents/wishElement"
import {ITasklist} from "./parentInterfaces";
import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {getCompleteTasklistParent} from "../api/parentApiRequests";
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";

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

    static styles = [css`
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
    `];

    constructor() {
        super();
        getCompleteTasklistParent(getCurrentUserId()).then((r : apiResponse) =>{
            if (r.results !== null) {
                this.tasklist = r.results
            }else{
                this.errorMessage = r.error
            }
            if(this.errorMessage){
                this.renderError()
            }
            //this.errorMessage = "r.error" //simulerer at der er en error besked
        })
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Error loading task info... </p>
        `;
    }

    goBack(){
        router.navigate("/parent")
    }

    createTaskList(){
        router.navigate("") //TODO !!!!!!!!!!!!!!!!!!!!!! MISSING!!!
    }

    private renderTasks(){
        if (this.errorMessage) {
            return html `
                <p> ${this.errorMessage} </p>
                <p> Please try again or please go back to main page </p>
            `;
        }
        //TODO PROBLEMER MED BOOL VÆRDIERNE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // KIG PÅ HVAD DER FOREGÅR HER:
        if(this.tasklist){
            return html `
                <h1>Opgaver:</h1>
                <button @click=${() => this.goBack()}>Tilbage</button><br>
                <button @click=${() => this.createTaskList()}>Opret Opgave</button><br>

                <section class="container">
                    ${this.tasklist.map(task => {
                console.log(task)
                return html `
                    <task-element .task=${task}></task-element>
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
