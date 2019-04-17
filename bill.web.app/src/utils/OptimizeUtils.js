
export default class OptimizeUtils {

    static prefetchHtmlAndSource(path){
        fetch(path, {cache: "no-store"})
            .then((d) => d.text())
            .then((d) => {
                let htmlElement = document.createElement('html');
                htmlElement.innerHTML = d;
                let sourceList = [...OptimizeUtils._getCSSSourceList(htmlElement), ...OptimizeUtils._getJSSourceList(htmlElement)];

                sourceList.forEach((item)=>{
                    let prefetchLink = document.createElement("link");
                    prefetchLink.setAttribute("rel", "prefetch");
                    prefetchLink.setAttribute("href", item);
                    document.getElementsByTagName("head")[0].appendChild(prefetchLink);
                    // fetch(item,{cache:"force-cache"}).then();
                })
            });
    }

    static requestFullScreen(){
        let doc = window.document;
        let docEl = doc.documentElement;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }
    }

    static _getJSSourceList(htmlElement){
        let elementList = htmlElement.getElementsByTagName("script");
        let sourceList = [];
        for (let i = 0; i < elementList.length; i++) {
            let item = elementList.item(i);
            sourceList.push(item.src);
        }
        return sourceList;
    }

    static _getCSSSourceList(htmlElement){
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
}
