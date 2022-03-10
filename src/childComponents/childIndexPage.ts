import {customElement,property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IAccountInfo, ITasklist} from "./childInterfaces";
import {getAssignedTasklist, getChildInfo} from "../api/childApiRequests";
import {IApiResponse} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/taskElement"
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";


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
        if(!this.tasklist) return html `Loading ...`;
        return html `
            <h1> Velkommen tilbage ${this.accountInfo.first_name}!</h1>
            <h3> Saldo: ${this.accountInfo.reward_balance}</h3>
            <div>
                ${this.renderTasks()}
            </div>
            <button @click="${() => router.navigate("/wishlist-overview")}"> Ønskelister </button>
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
        getChildInfo(getCurrentUserId()).then((r : IApiResponse) =>{
            if(r.results !== null){
                let tempList:IAccountInfo[] = r.results;
                this.accountInfo = tempList[0]
            }else{
                this.errorMessage = r.error;
            }
        })
        getAssignedTasklist(getCurrentUserId()).then((r : IApiResponse) =>{
            if (r.results !== null) {
                this.tasklist = r.results
            }else{
                this.errorMessage = r.error
            }
            if(this.errorMessage){
                this.renderError()
            }
        })
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Error loading task info... </p>
        `;
    }

    private renderTasks(){
        if (this.errorMessage) {
            return html `
                <p> ${this.errorMessage} </p>
                <p> Loading...</p>
            `;
        }
        if(this.tasklist){
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
        }else{
            return html `
                <p> Error loading Tasklist...</p>
            `;
        }
    }
}

