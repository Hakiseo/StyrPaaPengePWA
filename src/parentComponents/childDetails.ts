import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {IChildData} from "./parentInterfaces";
import {router} from "../index";
import {deleteChild, editChild, fetchChild, fetchChildTaskList} from "../api/parentApiRequests";
import {
    ButtonType,
    IApiResponse,
    ICustomErrorHandling,
    InputType,
    ITasklist
} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/inputElement"
import "../sharedComponents/buttonElement"
import "../sharedComponents/textDisplayElement"
import "../sharedComponents/errorMessage"

@customElement("child-details")
export class ChildDetails extends LitElement implements ICustomErrorHandling{
    @property() childData!: IChildData;
    @property() childId: string = "";
    @property() editMode: boolean = false;

    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() username: string = "";
    @property() age: number = 5;
    @property() balance: number = 0;

    @property() firstNameValid: boolean = true;
    @property() lastNameValid: boolean = true;
    @property() ageValid: boolean = true;
    @property() usernameValid: boolean = true;
    @property() balanceValid: boolean = true;

    @property() errorMessage: string = "";

    @property() taskList!: ITasklist[];

    static styles = [css`
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
    `];

    validated() {
        this.firstNameValid = this.firstName.length > 0 && this.firstName.length < 255
        this.lastNameValid = this.lastName.length > 0 && this.lastName.length < 255
        this.ageValid = this.age >= 5 && this.age <= 18
        this.usernameValid = this.username.length > 0 && this.username.length < 255
        this.balanceValid = this.balance >= 0 && this.balance < 100000000;

        if (!this.ageValid) {
            this.errorMessage = this.age > 18 ? "Find dig et arbejde..." : "Kontoejeren skal minimum v??re 5 ??r, for at oprette en konto!"
            return false;
        }

        if (!this.balanceValid) {
            this.errorMessage = "Start saldoen m?? ikke v??re mindre end 0! Den kan dog heller ikke v??re over 100 mil..."
            return false;
        }

        if (!this.firstNameValid || !this.lastNameValid || !this.ageValid || !this.usernameValid) {
            this.errorMessage = "Alle felter er p??kr??vet og ingen af felterne m?? overskride 254 karakterer!"
            return false;
        }

        if (this.username.includes("@")) {
            this.usernameValid = false;
            this.errorMessage = "Brugernavne til b??rne-konti m?? ikke indeholde '@'!"
            return false;
        }

        return true;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.childData) {
            let temp = router.lastResolved()
            if (temp && temp[0].data && temp[0].data.id) {
                this.childId = temp[0].data.id
                this.getChildData()
            } else {
                router.navigate("/parent")
            }
        }
        if (!this.taskList) {
            if (!this.childId) {
                let temp = router.lastResolved()
                if (temp && temp[0].data && temp[0].data.id) {
                    this.childId = temp[0].data.id
                }
            }
            this.getTaskListForChild()
        }
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("childData")) {
            this.firstName = this.childData.first_name
            this.lastName = this.childData.last_name
            this.username = this.childData.username
            this.age = this.childData.age
            this.balance = this.childData.reward_balance
        }
    }

    protected render(): TemplateResult {
        if (!this.childData) return html `
            <p> Intet data for det specifikke barn er fundet - Loading... </p>
            <p> Pr??v at g?? tilbage eller reload siden hvis der er g??et mere end 5 sekunder </p>
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => router.navigate("/parent")}"> Tilbage </button-element>
        `
        return html `
            ${this.editMode ? this.renderEdit() : this.renderView()}
            <div>
                ${this.renderButtons()}
            </div>
            <error-message> ${this.errorMessage} </error-message>
            ${this.renderTaskList()}
        `
    }

    renderTaskList() {
        if (!this.taskList) return html `<h2> Ingen opgaver tilknyttet dette barn </h2>`
        return html `
            <h2> Opgaver tilknyttet dette barn </h2>
            <section class="container">
                ${this.taskList.map(t => {
                    return html `
                    <task-element .task=${t} .parentView="${true}"></task-element>
                `
                })}
            </section>
        `
    }

    renderButtons() {
        if (this.editMode) {
            return html `
                <button-element .buttonType="${ButtonType.cancel}" .action="${() => {
                    this.errorMessage = ""
                    this.editMode = false
                }}"> Annullere </button-element>
                <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.detailsAction()}"> Gem </button-element>
            `
        }
        return html `
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => router.navigate("/parent")}"> Tilbage </button-element>
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => router.navigate(`/parent/childDetails/${this.childData.id}/changePassword`)}"> ??ndre Password </button-element>
            <button-element .buttonType="${ButtonType.delete}" deleteMessage="Er du sikker p?? at du vil slette barnet?" .action="${() => this.deleteJunior()}"> Slet </button-element>
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.detailsAction()}"> Rediger </button-element>
        `
    }

    renderView(): TemplateResult {
        return html `
            <h1> Detaljer for ${this.childData.first_name} </h1>
            <div>
                <p-element> Fornavn: ${this.childData.first_name} </p-element>
                <p-element> Efternavn: ${this.childData.last_name} </p-element>
                <p-element> Brugernavn: ${this.childData.username} </p-element>
                <p-element> Alder: ${this.childData.age} </p-element>
                <p-element> Saldo: ${this.childData.reward_balance} </p-element>
            </div>
        `
    }

    renderEdit(): TemplateResult {
        return html `
            <div>
                <input-element label="Fornavn" .value="${this.childData.first_name}" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
                <input-element label="Efternavn" .value="${this.childData.last_name}" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>
                <input-element label="Brugernavn" .value="${this.childData.username}" @changeValue="${(e: CustomEvent) => this.username = e.detail}"></input-element>
                <input-element .inputType="${InputType.number}" label="Alder" .value="${this.childData.age}" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
                <input-element .inputType="${InputType.number}" label="Saldo" .value="${this.childData.reward_balance}" @changeValue="${(e: CustomEvent) => this.balance = e.detail}"></input-element>
            </div>
        `
    }

    deleteJunior() {
        deleteChild(this.childId).then((r: IApiResponse) => {
            console.log(r)
            if (!r.error) {
                router.navigate("/parent")
            } else {
                this.errorMessage = r.error
            }
        })
    }

    detailsAction() {
        if (!this.editMode) {
            this.editMode = true;
            return;
        }

        if (this.validated()) {
            editChild({id: this.childId, first_name: this.firstName, last_name: this.lastName, username: this.username, age: this.age, balance: this.balance})
                .then((r: IApiResponse) => {
                    if (r.error) {
                        this.errorMessage = r.error
                    } else {
                        this.errorMessage = ""
                        console.log(r)
                        this.getChildData().then(() => this.editMode = false)
                    }
                })
        } else {
            window.alert(this.errorMessage)
        }
    }

    getChildData(): Promise<void> {
        return fetchChild(this.childId).then((r: IApiResponse) => {
            if (r.results && r.results.filter(d => d !== null).length > 0) {
                this.childData = r.results[0]
            }
        })
    }

    getTaskListForChild() {
        return fetchChildTaskList(this.childId).then((r: IApiResponse) => {
            if (r.results && r.results.filter(d => d !== null).length > 0) {
                this.taskList = r.results
                console.log("TASKS: ", this.taskList)
            }
        })
    }
}