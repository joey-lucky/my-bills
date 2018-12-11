import {createBrowserHistory} from "history";
import PreviewPhotoDialog from "./component/PreviewPhotoDialog";

export const browserHistory = createBrowserHistory(
    {basename: process.env["PUBLIC_PATH"] || ""}
);
export const previewPhotoState = PreviewPhotoDialog.newState();
