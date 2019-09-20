namespace gamelib {

    /**
     * @private
     */
    var getDefinitionByNameCache = {};

    /**
     * @function gamelib.getDefinitionByName
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @language zh_CN
     */
    export function getDefinitionByName(name:string):any {
        if (!name)
            return null;
        var definition = getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        var paths = name.split(".");
        var length = paths.length;
        definition = __global;
        for (var i = 0; i < length; i++) {
            var path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        getDefinitionByNameCache[name] = definition;
        return definition;
    }
}
var __global = this.__global || this;