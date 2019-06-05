
export interface DataBaseObserver {
     onInserted(tableName,value):void;
     onUpdated(tableName,value):void;
     onDeleted(tableName,id:string):void;
}

export default class DataBaseObserverFactory{
    readonly observerMap: Map<string, DataBaseObserver> = new Map();

    async onInserted(tableName,value):Promise<void>{
        let observers = this.observerMap.values();
        for(let observer of observers){
           await observer.onInserted(tableName, value);
        }
    }

    async onUpdated(tableName,value:any):Promise<void>{
        let observers = this.observerMap.values();
        for(let observer of observers){
            await observer.onUpdated(tableName, value);
        }
    }

    async onDeleted(tableName,id:string):Promise<void>{
        let observers = this.observerMap.values();
        for(let observer of observers){
            await observer.onDeleted(tableName, id);
        }
    }

    addObserver(key:string,observer:DataBaseObserver):void{
        this.observerMap.set(key, observer);
    }
}

