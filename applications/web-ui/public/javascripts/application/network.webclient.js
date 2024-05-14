$(document).ready(function(){

    const map = L.map('network-map').setView([38.219386, 21.746128], 10);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
    }).addTo(map);

    var marker = L.marker([38.737448286487595, 21.39876293182373]).addTo(map);

})
