import {customElement,property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IAccountInfo, ITasklist} from "./childInterfaces";
import {getAssignedTasklist, getChildInfo} from "../api/childApiRequests";
import {IApiResponse} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/taskElement"
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement";
import "../sharedComponents/errorMessage"

@customElement("child-index-page")
export class ChildIndexPage extends LitElement {
    @property() accountInfo!: IAccountInfo;
    @property() tasklist!: ITasklist[];
    @property({type: String}) errorMessage: string | null = "";

    connectedCallback() {
        super.connectedCallback();
        //Check and validate token with an api-call to see if we have access to the site
    }

    protected render(): TemplateResult {
        return html `
            <div>
                ${this.renderAccountInfo()}
            </div>
            <div>
                ${this.renderTasks()}
            </div>
            <button-element .action="${() => router.navigate("/wishlist-overview")}"> Ønskelister </button-element>
        `
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
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
        getChildInfo(getCurrentUserId()).then((r : IApiResponse) =>{
            if(r.results !== null){
                let tempList:IAccountInfo[] = r.results;
                this.accountInfo = tempList[0]
            }
            if(r.error){
                this.errorMessage = "Error child data..."
                this.displayError()
            }
        })
        getAssignedTasklist(getCurrentUserId()).then((r : IApiResponse) =>{
            if (r.results !== null) {
                this.tasklist = r.results
            }
            if(r.error){
                this.errorMessage = "Error loading task data..."
                this.displayError()
            }
        })
    }

    renderAccountInfo(){
        if(this.accountInfo){
            return html `
                <h1> Velkommen tilbage ${this.accountInfo.first_name}!</h1>
                <h3> Saldo: ${this.accountInfo.reward_balance}</h3>
            `;
        }else{
            console.log("Error loading AccountInfo")
            return html `
                <error-message> Error loading AccountInfo </error-message>
            `;
        }
    }

    private renderTasks(){
        if(!this.tasklist){
            return html `
                <error-message> Error loading tasklist </error-message>
            `;
        }else{
            return html `
                <h1>Opgaver:</h1>
                <section class="container">
                    ${this.tasklist.map(task => {
                        console.log(task)
                        return html `
                            <task-element .task=${task} .parentView="${false}"></task-element>
                        `
                    })}
                </section>
            `;
        }
    }
}
