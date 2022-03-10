import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {createJuniorUser} from "../api/parentApiRequests";
import {IApiResponse, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";
import {getCurrentUserId} from "../api/apiUtils";
import {router} from "../index";
import "../sharedComponents/buttonElement";
import "../sharedComponents/inputElement";

@customElement("create-child")
export class CreateChild extends LitElement implements ICustomErrorHandling {
    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() age: number = 3;
    @property() username: string = "";
    @property() password: string = "";
    @property() repeatedPassword: string = "";
    @property() startBalance: number = 0;

    @property() errorMessage: string = "";

    validated() {
        return true;
    }

    //TODO: validate input & visually show errors
    protected render(): TemplateResult {
        return html `
            <h1> Opret junior bruger </h1>
            
            <input-element label="Fornavn" @changeValue="${(e: CustomEvent) => this.firstName = e.detail}"></input-element>
            <input-element label="Efternavn" @changeValue="${(e: CustomEvent) => this.lastName = e.detail}"></input-element>

            <input-element .inputType="${InputType.number}" label="Alder" @changeValue="${(e: CustomEvent) => this.age = e.detail}"></input-element>
            <input-element label="Brugernavn" @changeValue="${(e: CustomEvent) => this.username = e.detail}"></input-element>

            <input-element label="Password" @changeValue="${(e: CustomEvent) => this.password = e.detail}"></input-element>
            <input-element label="Gentag password" @changeValue="${(e: CustomEvent) => this.repeatedPassword = e.detail}"></input-element>
            
            <input-element .inputType="${InputType.number}" label="Start Saldo" @changeValue="${(e: CustomEvent) => this.startBalance = e.detail}"></input-element>
            
            <button-element .action="${() => this.createNewJuniorUser()}"> Opret ny Junior-bruger</button-element>
        `;
    }

    createNewJuniorUser() {
        if (this.password !== this.repeatedPassword) {
            window.alert("The inputted passwords does not match!")
            return;
        }
        if (this.firstName && this.lastName && this.age && this.username && this.password && this.repeatedPassword && this.startBalance) {
            createJuniorUser({
                firstName: this.firstName,
                lastName: this.lastName,
                age: this.age,
                username: this.username,
                password: this.password,
                startBalance: this.startBalance,
                parentId: getCurrentUserId(),
            }).then((r: IApiResponse) => {
                if (!r.error) {
                    router.navigate("/parent")
                } else {
                    //TODO: visually show errors
                }
            })
        } else {
            window.alert("All fields are required!")
        }
    }
}