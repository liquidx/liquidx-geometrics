/** @typedef {typeof __propDef.props}  GeometricsViewerProps */
/** @typedef {typeof __propDef.events}  GeometricsViewerEvents */
/** @typedef {typeof __propDef.slots}  GeometricsViewerSlots */
export default class GeometricsViewer extends SvelteComponent<{
    piece: any;
}, {
    indexDidSelect: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type GeometricsViewerProps = typeof __propDef.props;
export type GeometricsViewerEvents = typeof __propDef.events;
export type GeometricsViewerSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        piece: any;
    };
    events: {
        indexDidSelect: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
