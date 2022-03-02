import { LitElement, TemplateResult } from "lit";
import { ITasklist } from "./childInterfaces";
import "./taskElement";
export declare class ChildIndexPage extends LitElement {
    tasklist: ITasklist[];
    errorMessage: string | null;
    protected render(): TemplateResult;
    constructor();
    private renderTasks;
}
//# sourceMappingURL=childIndexPage.d.ts.map