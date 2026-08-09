const osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
 maxZoom:22,attribution:'© OpenStreetMap'
});

// Replace with a proper satellite provider/API key for production.
const satellite=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
 maxZoom:22,attribution:'Satellite placeholder'
});

const map=L.map('map',{center:[28.6139,77.2090],zoom:18,layers:[osm]});

L.control.layers({"OpenStreetMap":osm,"Satellite":satellite}).addTo(map);
L.control.scale().addTo(map);

const input=document.getElementById('search');
const list=document.getElementById('suggestions');

async function search(q){
 const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`);
 const data=await r.json();
 list.innerHTML='';
 data.forEach(p=>{
   const d=document.createElement('div');
   d.className='item';
   d.textContent=p.display_name;
   d.onclick=()=>{
      map.setView([p.lat,p.lon],20);
      L.marker([p.lat,p.lon]).addTo(map).bindPopup(p.display_name).openPopup();
      list.innerHTML='';
      input.value=p.display_name;
   };
   list.appendChild(d);
 });
}

document.getElementById('go').onclick=()=>{ if(input.value) search(input.value); };

input.addEventListener('input',()=>{
 if(input.value.length>2) search(input.value);
 else list.innerHTML='';
});
