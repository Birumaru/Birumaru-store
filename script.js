// GANTI nomor WhatsApp admin (format internasional tanpa +)
var WA="6285380300492";
var PKGS=[["125 VP",15000],["420 VP",50000],["700 VP",80000],["1.375 VP",150000],["2.400 VP",250000],["4.000 VP",400000],["8.150 VP",800000]];
var RANKS=["Iron","Bronze","Silver","Gold","Platinum","Diamond","Ascendant","Immortal","Radiant"];
var COST=[15000,20000,30000,45000,65000,90000,130000,250000];
var sel=null;
function rp(n){return "Rp"+n.toLocaleString("id-ID")}
function $(i){return document.getElementById(i)}
function toast(m){var t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(function(){t.classList.remove("show")},2400)}

PKGS.forEach(function(p,i){
  var b=document.createElement("button");b.className="pkg";
  b.innerHTML="<b>"+p[0]+"</b><small>"+rp(p[1])+"</small>";
  b.onclick=function(){
    sel=i;document.querySelectorAll(".pkg").forEach(function(x){x.classList.remove("on")});
    b.classList.add("on");$("tlabel").textContent=p[0];$("tprice").textContent=rp(p[1]);renderTPay();
  };
  $("pkgs").appendChild(b);
});

RANKS.forEach(function(r,i){
  if(i<RANKS.length-1)$("from").add(new Option(r,i));
  if(i>0)$("to").add(new Option(r,i));
});
$("to").value=2;
function jokiTotal(){
  var f=+$("from").value,t=+$("to").value,s=0;
  if(t<=f){$("jlabel").textContent="Target harus lebih tinggi";$("jprice").textContent="Rp0";return 0}
  for(var i=f;i<t;i++)s+=COST[i];
  $("jlabel").textContent=RANKS[f]+" → "+RANKS[t];$("jprice").textContent=rp(s);return s;
}
$("from").onchange=$("to").onchange=jokiTotal;jokiTotal();

function getOrders(){try{return JSON.parse(localStorage.getItem("bms_orders")||"[]")}catch(e){return []}}
function saveOrder(o){try{var l=getOrders();l.push(o);localStorage.setItem("bms_orders",JSON.stringify(l.slice(-30)))}catch(e){}}
function wa(text){
  var id="BMS-"+Date.now().toString(36).toUpperCase().slice(-5)+Math.random().toString(36).slice(2,5).toUpperCase();
  saveOrder({id:id,text:text,t:Date.now()});
  $("sid").value=id;
  toast("Pesanan dibuat: "+id);
  window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(text+"\n• No. Pesanan: "+id),"_blank");
}
async function renderStatus(){
  var id=$("sid").value.trim().toUpperCase(),box=$("sres");box.textContent="";
  if(!id)return toast("Masukkan nomor pesanan");
  var o=getOrders().filter(function(x){return x.id===id})[0],st=null;
  if(DB){try{var sd=await DB.doc("status/"+id).get();if(sd.exists)st=sd.data().s}catch(e){}}
  var d=document.createElement("div");d.className="ores";
  if(o||st){
    var h=document.createElement("b");h.textContent=id;
    var bd=document.createElement("span");bd.className="badge";bd.textContent=st||"Menunggu konfirmasi admin";
    var pre=document.createElement("pre");
    pre.textContent=!o?"":o.text.split("\n").slice(1).join("\n")+"\n• Dibuat: "+new Date(o.t).toLocaleString("id-ID");
    d.append(h," ",bd,pre);
  }else{d.textContent="Pesanan "+id+" tidak ditemukan di perangkat ini."}
  var a=document.createElement("a");a.className="btn";a.style.marginTop="12px";a.target="_blank";
  a.href="https://wa.me/"+WA+"?text="+encodeURIComponent("Halo Birumaru Store, saya mau cek status pesanan "+id);
  a.textContent="Tanyakan ke Admin";d.append(a);box.append(d);
}
$("chk").onclick=renderStatus;

$("orderTopup").onclick=function(){
  var id=$("rid").value.trim();
  if(sel===null)return toast("Pilih nominal VP dulu");
  if(!$("tsender").value.trim())return toast("Isi nama pengirim pembayaran");
  if(!$("tpaid").checked)return toast("Konfirmasi pembayaran dulu");
  if(!/^.+#.+$/.test(id))return toast("Isi Riot ID dengan format Nama#TAG");
  wa("Halo Birumaru Store, saya mau topup:\n• Paket: "+PKGS[sel][0]+"\n• Harga: "+rp(PKGS[sel][1])+"\n• Riot ID: "+id+"\n• Pembayaran: "+TP[tIdx].n+" | Pengirim: "+$("tsender").value.trim());
};
$("orderJoki").onclick=function(){
  if(!jokiTotal())return toast("Pilih target rank yang lebih tinggi");
  try{sessionStorage.setItem("bms_ck",JSON.stringify({f:$("from").value,t:$("to").value}))}catch(e){}
  location.hash="checkout";
};
$("orderJoki2").onclick=function(){
  var s=jokiTotal(),id=$("jid").value.trim();
  if(!s)return toast("Pilih target rank yang lebih tinggi");
  if(!/^.+#.+$/.test(id))return toast("Isi Riot ID dengan format Nama#TAG");
  if(!$("jagree").checked)return toast("Centang persetujuan risiko dulu");
  if(!$("jsender").value.trim())return toast("Isi nama pengirim pembayaran");
  if(!$("jpaid").checked)return toast("Konfirmasi pembayaran dulu");
  wa("Halo Birumaru Store, saya mau order joki:\n• Rank: "+$("jlabel").textContent+"\n• Harga: "+rp(s)+"\n• Riot ID: "+id+"\n• Pembayaran: "+PAY[payIdx].n+" | Pengirim: "+$("jsender").value.trim()+"\n• Catatan: "+($("jnote").value||"-"));
};

// GANTI nomor/rekening pembayaran di bawah ini dengan milikmu
var PAY=[
  {n:"QRIS",acc:"",note:"Admin mengirim kode QRIS lewat WhatsApp setelah pesanan masuk."},
  {n:"DANA",acc:"085380300492",an:"Aidil Ibnu Ahmad"},
  {n:"OVO",acc:"085380300492",an:"Aidil Ibnu Ahmad"},
  {n:"GoPay",acc:"085380300492",an:"Aidil Ibnu Ahmad"},
  {n:"Transfer Bank",acc:"BCA 0000000000",an:"Birumaru Store"}
],payIdx=0;
function renderPay(){
  document.querySelectorAll("#paym .pkg").forEach(function(b,i){b.classList.toggle("on",i===payIdx)});
  var p=PAY[payIdx],box=$("payinfo");box.textContent="";
  var t=document.createElement("div");t.style.fontWeight="700";t.textContent="Total bayar: "+$("jprice").textContent;box.append(t);
  if(p.acc){
    var l=document.createElement("div");l.style.marginTop="8px";l.textContent=p.n+": "+p.acc+" (a.n. "+p.an+")";
    var c=document.createElement("button");c.type="button";c.className="tbtn";c.style.marginLeft="8px";c.textContent="Salin";
    c.onclick=function(){try{navigator.clipboard.writeText(p.acc).then(function(){toast("Nomor disalin")},function(){toast("Gagal menyalin")})}catch(e){toast("Gagal menyalin")}};
    l.append(c);box.append(l);
  }
  var n=document.createElement("div");n.style.cssText="margin-top:8px;color:var(--muted)";
  n.textContent=p.note||"Transfer sesuai total, lalu kirim bukti pembayaran ke WhatsApp admin.";box.append(n);
}
PAY.forEach(function(p,i){var b=document.createElement("button");b.type="button";b.className="pkg";b.innerHTML="<b>"+p.n+"</b>";b.onclick=function(){payIdx=i;renderPay()};$("paym").appendChild(b)});
function fillPay(box,p,total){
  box.textContent="";
  var t=document.createElement("div");t.style.fontWeight="700";t.textContent=total;box.append(t);
  if(p.acc){
    var l=document.createElement("div");l.style.marginTop="8px";l.textContent=p.n+": "+p.acc+" (a.n. "+p.an+")";
    var c=document.createElement("button");c.type="button";c.className="tbtn";c.style.marginLeft="8px";c.textContent="Salin";
    c.onclick=function(){try{navigator.clipboard.writeText(p.acc).then(function(){toast("Nomor disalin")},function(){toast("Gagal menyalin")})}catch(e){toast("Gagal menyalin")}};
    l.append(c);box.append(l);
  }
  var n=document.createElement("div");n.style.cssText="margin-top:8px;color:var(--muted)";
  n.textContent=p.note||"Transfer sesuai total, lalu kirim bukti pembayaran ke WhatsApp admin.";box.append(n);
}
var TP=PAY.filter(function(p){return p.n==="QRIS"||p.n==="Transfer Bank"}),tIdx=0;
function renderTPay(){
  document.querySelectorAll("#tpaym .pkg").forEach(function(b,i){b.classList.toggle("on",i===tIdx)});
  fillPay($("tpayinfo"),TP[tIdx],sel===null?"Pilih paket VP dulu":"Total bayar: "+rp(PKGS[sel][1]));
}
TP.forEach(function(p,i){var b=document.createElement("button");b.type="button";b.className="pkg";b.innerHTML="<b>"+p.n+"</b>";b.onclick=function(){tIdx=i;renderTPay()};$("tpaym").appendChild(b)});
renderTPay();
function route(){
  var ck=location.hash==="#checkout";
  if(ck&&!jokiTotal()){location.hash="joki";return}
  document.body.classList.toggle("checkout",ck);
  if(ck){$("clabel").textContent=$("jlabel").textContent;$("cprice").textContent=$("jprice").textContent;renderPay();window.scrollTo(0,0)}
  else if(location.hash.length>1){var el=document.getElementById(location.hash.slice(1));if(el)el.scrollIntoView()}
}
try{var ck0=JSON.parse(sessionStorage.getItem("bms_ck"));if(ck0){$("from").value=ck0.f;$("to").value=ck0.t;jokiTotal()}}catch(e){}
window.addEventListener("hashchange",route);route();
$("yr").textContent=new Date().getFullYear();
var STATUS=["Menunggu konfirmasi admin","Pembayaran diterima","Sedang diproses","Selesai","Dibatalkan"],DB=null;
function initAdmin(){
  $("admin").hidden=false;$("navadm").hidden=false;
  $("aadd").onclick=function(){
    var id=$("aid").value.trim().toUpperCase(),dt=$("adet").value.trim();
    if(!/^BMS-[A-Z0-9]+$/.test(id)||!dt)return toast("Isi nomor (BMS-XXXXXXXX) dan detail");
    var t=Date.now();
    DB.doc("orders/"+id).set({id:id,text:dt,t:t,s:STATUS[0]})
      .then(function(){return DB.doc("status/"+id).set({s:STATUS[0],t:t})})
      .then(function(){$("aid").value="";$("adet").value="";toast("Pesanan ditambahkan")})
      .catch(function(){toast("Gagal menyimpan")});
  };
  var tm=setTimeout(function(){$("alist").textContent="Memuat terlalu lama."},10000);
  DB.collection("orders").orderBy("t","desc").limit(100).onSnapshot(function(snap){
    clearTimeout(tm);var box=$("alist");box.textContent="";
    if(!snap.docs.length)box.textContent="Belum ada pesanan. Tambahkan dari chat WhatsApp pelanggan.";
    snap.docs.forEach(function(ds){
      var o=ds.data(),r=document.createElement("div");r.className="ores";r.style.marginBottom="10px";
      var h=document.createElement("b");h.textContent=o.id;
      var p=document.createElement("pre");p.textContent=o.text+"\n• "+new Date(o.t).toLocaleString("id-ID");
      var s=document.createElement("select");
      STATUS.forEach(function(x){s.add(new Option(x))});s.value=o.s;
      s.onchange=function(){
        DB.doc("orders/"+o.id).update({s:s.value})
          .then(function(){return DB.doc("status/"+o.id).set({s:s.value,t:Date.now()})})
          .then(function(){toast("Status diperbarui")}).catch(function(){toast("Gagal memperbarui")});
      };
      var x=document.createElement("button");x.className="tbtn";x.textContent="Hapus";x.style.marginTop="8px";
      x.onclick=function(){
        if(!x.dataset.c){x.dataset.c=1;x.textContent="Yakin hapus?";return}
        DB.doc("orders/"+o.id).delete().then(function(){return DB.doc("status/"+o.id).delete()}).catch(function(){toast("Gagal menghapus")});
      };
      r.append(h,p,s,x);box.append(r);
    });
  },function(){clearTimeout(tm);$("alist").textContent="Tidak bisa memuat data."});
}
(async function(){
  try{
    var u=await claude.use("user"),d=await claude.use("db");
    if(d){DB=d;if(u&&await u.canEdit())initAdmin()}
  }catch(e){}
})();
$("theme").onclick=function(){
  var r=document.documentElement,dark=r.getAttribute("data-theme")==="dark"||(!r.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches);
  r.setAttribute("data-theme",dark?"light":"dark");
};
