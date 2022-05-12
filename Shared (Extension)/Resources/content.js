browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});


function removeAds(node) {
    switch(node.nodeType) {
        case Node.ELEMENT_NODE: {
            var placeholder = node.getAttribute("data-ad-placeholder");
            var root = node.getAttribute("data-component-root");
            var id = node.getAttribute("class");
            if (placeholder || root == "LeaderboardAd" || (id&&id.includes("page-ad"))) {
                node.parentNode.removeChild(node);
            }
            
            var child = node.firstChild;
            while(child) {
                var next = child.nextSibling;
                removeAds(child);
                child = next;
            }
        } break;
    }
}

(function(node) {
    removeAds(node);
    var obs = new window.WebKitMutationObserver(function(e){
        var num = 0;
        e.forEach(rec=>rec.addedNodes.length&&num++);
        if (num) {removeAds(node);}
    });
    obs.observe(node, {childList:true, subtree:true});
})(document.body);
