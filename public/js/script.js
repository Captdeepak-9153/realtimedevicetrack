const socket = io(); // It will send a connection request to the backend

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords; // It will give you latitude and longitude of that location
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0, // No caching means no data save in the local memory
        timeout: 5000
    });
}

// Create the map and assign it to a variable
const map = L.map("map").setView([0, 0], 16);

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Deepak's House"
}).addTo(map);


const markers = {}

socket.on("recieve-location" , (data)=>{
    const {id , latitude, longitude } = data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude , longitude]);
    }
    else {
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected" , (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})