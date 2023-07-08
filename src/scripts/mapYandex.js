;(function() {
    let myMap;

    const init = () => {
        myMap = new ymaps.Map("map", {
        center: [59.122613, 37.903466],
        zoom: 12,
        controls: []
        });

        const coords = [
        [59.132231 ,37.933373],
        [59.094138, 37.924574],
        [59.119801, 38.000195],
        ];

        const myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: './img/icons/marker.svg',
        iconImageSize: [46, 57],
        iconImageOffset: [-35, -52]
        });

        coords.forEach(coord => {
        myCollection.add(new ymaps.Placemark(coord));
        });

        myMap.geoObjects.add(myCollection);
        myMap.behaviors.disable('scrollZoom');
    };

    ymaps.ready(init);
})()