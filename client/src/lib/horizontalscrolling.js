

// do horizontal scrolling with mouse wheel when over gallery
// see https://css-tricks.com/snippets/jquery/horz-scroll-with-mouse-wheel/
// from a feb 2016 comment
//. not working in chrome? 
var horizontalscrolling = function(element) {
    let divToScroll = document.getElementById(element);
    if (divToScroll) {
        let doScroll = function(e) {
            e = window.event || e;
            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            divToScroll.scrollBy(-delta * 100, 0); // divToScroll is saved in this closure
            e.preventDefault();
        };
        if (divToScroll.addEventListener) {
            divToScroll.addEventListener("mousewheel", doScroll, false);
            divToScroll.addEventListener("DOMMouseScroll", doScroll, false);
        } else {
            divToScroll.attachEvent("onmousewheel", doScroll);
        }
    }
};

export default horizontalscrolling;
