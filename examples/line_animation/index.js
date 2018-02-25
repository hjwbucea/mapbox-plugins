// import * as Alex from '../../src/index';

var data = null;
// var mapCenter = [121.470, 31.165];
var mapCenter = [-4.534, 39.749];
var animation = null;
var map = new mapboxgl.Map({
    style: Alex.Config.default.mapStyles,
    // style: "mapbox://styles/mapbox/dark-v9",
    center: mapCenter,
    zoom: 7.6,
    maxzoom: 10,
    pitch: 15,
    container: 'map',
    hash: true
});

map.on('load', function() {
    console.log("map loaded...");
    Alex.myTween.fps = 40;
    Alex.myTween.loop = true;
    init();
});

function init() {
    var objNum = 14, canvasLayer = new Alex.CanvasOverlayer({
        map: map,
        shadow: true,
        keepTrack: true,
        xfield: 'lng',
        yfield: 'lat'
    });
    domLayer = new Alex.DomOverlayer({
        map: map,
        doms: [
        ]});

    Alex.Util.getJSON('../../assets/demo/toledo2sevilla.json')
        .then((res) => {
                data = res.routes[0].geometry; // consider simplify data.coordinates..
                console.log("got routes data..");
                domLayer.setDoms([{
                    resources: ['https://wx2.sinaimg.cn/mw690/4507b64aly1fom2fkkywkj218w0u0b29.jpg'],
                    content: "西班牙-托莱多",
                    lon: data.coordinates[0][0],
                    lat: data.coordinates[0][1]
                }]);
                setTimeout(update, 500);
        });
    
    function update(){
        animation = requestAnimationFrame(update);
        animateLine(data); // first rerender.. then register next frame function.
    }

    /**
     * animate routes from start to end.
     * @param {*input geometry or feature} data 
     */
    function animateLine(data) {
        if (typeof data == 'undefined'|| !Array.isArray(data.coordinates)) return;
        var segmentNum = data.coordinates.length;
        var currentIndex = canvasLayer.getTracks().length;
        if (currentIndex < (segmentNum -1)) {
            // add one stopPoint to render for each frame.
            canvasLayer.redraw(arr2objs(data.coordinates[currentIndex + 1]));
        } else {
            domLayer.setDoms(domLayer.domOpts.slice(0,1).concat({
                resources: ['https://wx4.sinaimg.cn/mw690/4507b64aly1fmjnc9rqqaj21kw11tu0z.jpg'],
                content: "塞维利亚",
                lon: data.coordinates[segmentNum-1][0],
                lat: data.coordinates[segmentNum-1][1]
            }));
            // cancelAnimationFrame(animation)
            canvasLayer.setTracks([]); // restart route animation
        }
    }

    function arr2objs(lnglat) {
        if (!Array.isArray(lnglat) || lnglat.length != 2) return null;
        return [{lng: lnglat[0], lat: lnglat[1], }];
    }
}
