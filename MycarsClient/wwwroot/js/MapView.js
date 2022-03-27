function InitMapView()
{
    var map = new MapView();
    map.Init();
}
function MapView() {
    mapViewThis = this;
    map = null;
    mapdata = null;
    helper = new Helper();
}
MapView.prototype = {
    Init: function () {
        mapViewThis.GetMapData();
        mapViewThis.InitiateMap();
    },
    GetMapData: function () {
        helper.AjaxGet("GetMapData", function (json) {
            mapdata = json;
        });
    },
    InitiateMap: function () {
        //var map = L.map('map').setView([12.517, -79.158], 13);
        //L.tileLayer("https://api.mapbox.com/styles/v1/swethaaraghu/cl17l66hi004e15ljxuh6tn5l/tiles/512/7/0/0?access_token=pk.eyJ1Ijoic3dldGhhYXJhZ2h1IiwiYSI6ImNsMTdreHMwdTA0Y2szY3J6dnZiYTcxd3MifQ.tGrQ516g9jfGeKezGnjLew", {
        //    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //    maxZoom: 18,
        //    id: 'styles/swethaaraghu/cl17l66hi004e15ljxuh6tn5l',
        //    tileSize: 1024,
        //    zoomOffset: 0,
        //    accessToken: 'pk.eyJ1Ijoic3dldGhhYXJhZ2h1IiwiYSI6ImNsMTdreHMwdTA0Y2szY3J6dnZiYTcxd3MifQ.tGrQ516g9jfGeKezGnjLew'
        //}).addTo(map);
        
        mapboxgl.accessToken = _accessToken;

        map = new mapboxgl.Map({
            container: 'map',
            style: _mapStyle,
            center: [-103.5917, 40.6699],
            zoom: 3
        });
        map.on('styledata', () => {
            // Add a new source from our GeoJSON data and
            // set the 'cluster' option to true. GL-JS will
            // add the point_count property to your source data.

            const waiting = () => {
                if (!map.isStyleLoaded()) {
                    setTimeout(waiting, 200);
                } else {
                    mapViewThis.AddLayers();
                }
            };
            waiting();

           
        });
       
    },
    AddLayers: function () {
        map.addSource('cars', {
            type: 'geojson',
            data: mapdata,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points
        });

       
        map.addLayer({
            'id': 'cars',
            'type': 'circle',
            'source': 'cars',
            'paint': {
                'circle-color': '#4264fb',
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        map.on('mouseenter', 'cars', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            var coordinates = e.features[0].geometry.coordinates.slice();
            var vin = e.features[0].properties.VinNumber;
            var Driver = e.features[0].properties.DriverName;
            var LicensePlateNumber = e.features[0].properties.LicensePlateNumber;
            var speed = e.features[0].properties.Speed;
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.            

            if (vin != undefined)
            {
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                var design = "<h6 style='margin-bottom:3px'>Vin : " + vin + "</h6><h6 style='margin-bottom:3px'>Driver Name : " + Driver + "</h6><h6 style='margin-bottom:3px'>License Plate Number : " + LicensePlateNumber + "</h6>" +
                    "<h6 style='margin-bottom:3px'>Speed : " + speed + "</h6>";
                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(design).addTo(map);
            }
            
        });

        map.on('mouseleave', 'cars', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }
}