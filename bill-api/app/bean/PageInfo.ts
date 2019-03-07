class PageInfo {
    public static createPageInfo(pageInfo: PageInfo, rowCount: number): PageInfo {
        let {pageSize, pageIndex} = pageInfo;
        let pageCount = Number.parseInt((rowCount + pageSize - 1) / pageSize);
        let newPageInfo = new PageInfo(pageIndex, pageSize);
        newPageInfo.rowCount = rowCount;
        newPageInfo.pageCount = pageCount;
        return newPageInfo;
    }

    public pageSize: number;
    public pageIndex: number;
    public pageCount: number = 0;
    public rowCount: number = 0;

    constructor(pageIndex: number = 0, pageSize?: number = 15) {
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
    }
}