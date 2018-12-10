import {createBrowserHistory} from "history";
import PreviewPhotoDialog from "./component/PreviewPhotoDialog";

export const browserHistory = createBrowserHistory(
    // {basename: "/web/admin"}
);
export const previewPhotoState = PreviewPhotoDialog.newState();
