import { LitElement, TemplateResult } from 'lit';
import Navigo from "navigo";
import "./childComponents/childIndexPage";
import "./childComponents/wishlistOverviewPage";
import "./parentComponents/parentIndexPage";
import "./childComponents/wishDetail";
import "./childComponents/wishCreatePage";
import "./home";
export declare const router: Navigo;
export declare class IndexElement extends LitElement {
    get route(): void | TemplateResult<1 | 2>;
    set route(value: void | TemplateResult<1 | 2>);
    private _route;
    count: number;
    constructor();
    render(): TemplateResult;
    render404(): TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map