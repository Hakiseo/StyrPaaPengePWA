import { LitElement, TemplateResult } from "lit";
import { ITasklist } from "./childInterfaces";
import "./taskElement";
export declare class ChildIndexPage extends LitElement {
    tasklist: ITasklist[];
    errorMessage: string | null;
    connectedCallback(): void;
    protected render(): TemplateResult;
    static styles: import("lit").CSSResult[];
    constructor();
    private renderTasks;
}
//# sourceMappingURL=childIndexPage.d.ts.map