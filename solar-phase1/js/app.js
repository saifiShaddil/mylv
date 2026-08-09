
const map=new maplibregl.Map({
 container:'map',
 style:'https://demotiles.maplibre.org/style.json',
 center:[77.2090,28.6139],
 zoom:18
});
map.addControl(new maplibregl.NavigationControl());

const draw=new MapboxDraw({
 displayControlsDefault:false,
 controls:{polygon:true,trash:true}
});
map.addControl(draw);

map.on('draw.create',updateArea);
map.on('draw.update',updateArea);
map.on('draw.delete',()=>alert('Roof deleted'));

function updateArea(){
 const d=draw.getAll();
 if(!d.features.length) return;
 const a=turf.area(d);
 alert("Roof Area: "+a.toFixed(2)+" m²");
}

document.getElementById('btnUndo').onclick=()=>{
 const d=draw.getAll();
 if(d.features.length){
   draw.delete(d.features[d.features.length-1].id);
 }
};

document.getElementById('btnSearch').onclick=async()=>{
 const q=document.getElementById('search').value.trim();
 if(!q) return;
 const r=await fetch('https://photon.komoot.io/api/?q='+encodeURIComponent(q)+'&limit=5');
 const j=await r.json();
 if(!j.features.length){alert('No result');return;}
 const c=j.features[0].geometry.coordinates;
 map.flyTo({center:c,zoom:20});
 new maplibregl.Marker().setLngLat(c).addTo(map);
};
