
const osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:22});
const esri=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'Esri'});
const map=L.map('map',{center:[28.6139,77.2090],zoom:19,layers:[esri]});
L.control.layers({"Satellite (Esri)":esri,"OpenStreetMap":osm}).addTo(map);
L.control.scale().addTo(map);

document.getElementById('go').onclick=async()=>{
 const q=document.getElementById('search').value;
 const r=await fetch("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q="+encodeURIComponent(q));
 const d=await r.json();
 if(d.length) map.setView([+d[0].lat,+d[0].lon],20);
};

const fg=new L.FeatureGroup().addTo(map);
map.addControl(new L.Control.Draw({
 edit:{featureGroup:fg},
 draw:{marker:false,polyline:false,circlemarker:false}
}));

let roof=null;
function updateInfo(){
 if(!roof){document.getElementById("info").textContent="Draw one roof.";return;}
 let area=roof instanceof L.Circle?Math.PI*roof.getRadius()*roof.getRadius():turf.area(roof.toGeoJSON());
 document.getElementById("info").innerHTML="<b>Roof Area:</b> "+area.toFixed(2)+" m²";
}
map.on(L.Draw.Event.CREATED,e=>{
 if(roof) fg.removeLayer(roof);
 roof=e.layer; fg.addLayer(roof); updateInfo();
});
map.on(L.Draw.Event.EDITED,updateInfo);
map.on(L.Draw.Event.DELETED,()=>{roof=null;updateInfo();});
