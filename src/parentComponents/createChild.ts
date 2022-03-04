import {html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {createJuniorUser} from "../api/parentApiRequests";
import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {apiFetch, apiPost, getIdentityToken, getCurrentUserId} from "../api/apiUtils";

@customElement("create-child")
export class CreateChild extends LitElement {
    @property() firstName: string = "";
    @property() lastName: string = "";
    @property() age: number = 3;
    @property() username: string = "";
    @property() password: string = "";
    @property() repeatedPassword: string = "";
    @property() startBalance: number = 0;

    //TODO: validate input & visually show errors
    protected render(): TemplateResult {
        return html `
            <h1> Opret junior bruger </h1>
            
            <label for="firstName"> Fornavn: </label>
            <input type="text" name="firstName" id="firstName" @change="${(e: any) => this.firstName = e.target.value}">

            <label for="lastName"> Efternavn: </label>
            <input type="text" name="lastName" id="lastName" @change="${(e: any) => this.lastName = e.target.value}">

            <label for="age"> Alder: </label>
            <input type="number" value="${this.age}" name="age" id="age" @change="${(e: any) => this.age = e.target.value}">

            <label for="username"> Brugernavn: </label>
            <input type="text" name="username" id="username" @change="${(e: any) => this.username = e.target.value}">

            <label for="password"> Password: </label>
            <input type="password" name="password" id="password" @change="${(e: any) => this.password = e.target.value}">

            <label for="repeatedPassword"> Gentag Password: </label>
            <input type="text" name="repeatedPassword" id="repeatedPassword" @change="${(e: any) => this.repeatedPassword = e.target.value}">

            <label for="startBalance"> Start beløb: </label>
            <input type="number" value="${this.startBalance}" name="startBalance" id="startBalance" @change="${(e: any) => this.startBalance = e.target.value}">
            
            <button @click="${() => this.createNewJuniorUser()}"> Opret ny Junior-bruger</button>
            <button @click="${() => this.test()}"> test to fail post </button>
            <button @click="${() => this.test2()}"> test to fail get </button>
        `;
    }

    //TODO: Delete after testing
    //Expect test to fail - Accessing child routes from Parent user
    test() {
        apiPost("child/test", {})
    }

    //TODO: Delete after testing
    test2() {
        apiFetch("child/test")
    }

    createNewJuniorUser() {
        console.log(getIdentityToken())
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
            }).then((r: apiResponse) => console.log(r))
        } else {
            window.alert("All fields are required!")
        }
    }
}