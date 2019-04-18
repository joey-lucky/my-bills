export default class OptimizeUtils {

    static prefetchHtmlAndSource(path) {
        fetch(path, {cache: "no-store"})
            .then(d => d.text())
            .then((d) => {
                let htmlElement = document.createElement("html");
                htmlElement.innerHTML = d;
                let sourceList = [...OptimizeUtils._getCSSSourceList(htmlElement), ...OptimizeUtils._getJSSourceList(htmlElement)];

                // 根据浏览器类型选择预加载方式
                let userAgent = window.navigator.userAgent;
                if (userAgent.indexOf("Firefox") ||
                    userAgent.indexOf("Chrome")) {
                    this._prefetchSource(sourceList);
                } else {
                    this._fetchSource(sourceList);
                }
            });
    }

    static highFrequencyMethod(method) {
        let runRequestTime = 0;
        return () => {
            runRequestTime = Date.now();
            setTimeout(() => {
                if (Date.now() - runRequestTime === 100) {
                    method.apply(this);
                }
            }, 100);
        };
    }

    static _getJSSourceList(htmlElement) {
        let elementList = htmlElement.getElementsByTagName("script");
        let sourceList = [];
        for (let i = 0; i < elementList.length; i++) {
            let item = elementList.item(i);
            sourceList.push(item.src);
        }
        return sourceList;
    }

    static _getCSSSourceList(htmlElement) {
        let elementList = htmlElement.getElementsByTagName("link");
        let sourceList = [];
        for (let i = 0; i < elementList.length; i++) {
            let item = elementList.item(i);
            if (item.rel === "stylesheet") {
                sourceList.push(item.href);
            }
        }
        return sourceList;
    }

    static _prefetchSource(sourceList) {
        sourceList.forEach((item) => {
            let prefetchLink = document.createElement("link");
            prefetchLink.setAttribute("rel", "prefetch");
            prefetchLink.setAttribute("href", item);
            document.getElementsByTagName("head")[0].appendChild(prefetchLink);
            // fetch(item,{cache:"force-cache"}).then();
        });
    }

    static _fetchSource(sourceList) {
        sourceList.forEach((item) => {
            fetch(item, {cache: "force-cache"}).then();
        });
    }

}
