export default class ModelUtils {
    // 获取model子项，避免各种undefined,api同后台
    static getRelationModel(model, tableName) {
        if (model && model.relationModelMap) {
            let relationModelList = model.relationModelMap[tableName];
            if (relationModelList) {
                return relationModelList;
            }
        }
        return [];
    }
}
