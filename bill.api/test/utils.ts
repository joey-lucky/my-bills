import * as path from "path";

const projectPath = path.resolve("");

export function getCurrFilePath(path= "") {
    return path.substr(projectPath.length)
        .replace(".test.ts", "")
        .replace(/\\/g, "/");
}