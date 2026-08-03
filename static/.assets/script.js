
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let bgcanvas = document.getElementById("bg-canvas");
let bgctx = bgcanvas.getContext("2d");
bgcanvas.width = 400;
bgcanvas.height =  bgcanvas.width *1.5;

canvas.width = 200;
canvas.height =  canvas.width *1.5;


let rambutFl = new Image();
rambutFl.src = "../static/.assets/rambut_fl.png";
let rambutF = new Image();
rambutF.src = "../static/.assets/rambut_f.png";
let rambutFr = new Image();
rambutFr.src = "../static/.assets/rambut_fr.png";
let rambutR = new Image();
rambutR.src = "../static/.assets/rambut_r.png";
let rambutL = new Image();
rambutL.src = "../static/.assets/rambut_l.png";
let wajah = new Image();
wajah.src = "../static/.assets/wajah.png";
let leher = new Image();
leher.src = "../static/.assets/leher.png";
let tanganL = new Image();
tanganL.src = "../static/.assets/tangan_l.png";
let lenganL = new Image();
lenganL.src = "../static/.assets/lengan_l.png";
let lenganR = new Image();
lenganR.src = "../static/.assets/lengan_r.png";
let jariR = new Image();
jariR.src = "../static/.assets/jari_r.png";
let jariL = new Image();
jariL.src = "../static/.assets/jari_l.png";
let badan = new Image();
badan.src = "../static/.assets/badan.png";
let tanganR = new Image();
tanganR.src = "../static/.assets/tangan_r.png";
let rambutB = new Image();
rambutB.src = "../static/.assets/rambut_b.png";
let rok = new Image();
rok.src = "../static/.assets/rok.png";
let background = new Image();
background.src = "../static/background.png";

let kons = canvas.width /1000;
// m = kemiringan
let sendi = {
	mainPoros : {x:500*kons,y:780*kons,m:0},
	bahuR :{x:600*kons,y:300*kons,m:0},
	bahuL : {x:350*kons,y:300*kons,m:0},
	sikuR : {x:640*kons,y:500*kons,m:0},
	sikuL : {x:340*kons,y:500*kons,m:0},
	pergelanganR : {x:700*kons,y:700*kons,m:0},
	pergelanganL : {x:320*kons,y:700*kons,m:0},
	pangkalLeher : {x:500*kons,y:250*kons,m:0},
	rambutAtas : {x:480*kons,y:80*kons,m:0},
	rambutL : {x:560*kons,y:120*kons,m:0},
	rambutR : {x:390*kons,y:120*kons,m:0},
	rambutL2 : {x:550*kons,y:140*kons,m:0},
	rambutR2 : {x:400*kons,y:140*kons,m:0}
}

let arahKanan = true;
let openTime = 0;
let canvh = canvas.height*2/3;
function drawAnimation() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	bgctx.fillStyle = "black";
	//kasih waktu yang cukup untuk loading assets
	openTime+= (1/60);
	// jika waktu < 1 detik, tutup kanvas, jika >1, buka
	if (openTime<1) bgctx.fillRect(0,0,bgcanvas.width,bgcanvas.height);
   bgctx.drawImage(background,0,0,
		bgcanvas.width,bgcanvas.height);
	ctx.drawImage(rok,0,0,
		canvas.width,canvas.height);
	ctx.save(); //Main
	ctx.translate(sendi.mainPoros.x,sendi.mainPoros.y);
	ctx.rotate((Math.PI/180) * sendi.mainPoros.m);
	ctx.drawImage(badan,-sendi.mainPoros.x,-sendi.mainPoros.y,
		canvas.width,canvh);


	ctx.save(); //Bahu kiri, Sendi Cabang 1
        ctx.translate(
		sendi.bahuL.x-sendi.mainPoros.x,
		sendi.bahuL.y-sendi.mainPoros.y);
        ctx.rotate((Math.PI/180) * sendi.bahuL.m);
	ctx.drawImage(lenganL,-sendi.bahuL.x,-sendi.bahuL.y,
		canvas.width,canvh);

	ctx.translate( //Siku, sub Cabang 1A
                sendi.sikuL.x-sendi.bahuL.x,
                sendi.sikuL.y-sendi.bahuL.y);
        ctx.rotate((Math.PI/180) * sendi.sikuL.m);
        ctx.drawImage(tanganL,-sendi.sikuL.x,-sendi.sikuL.y,
                canvas.width,canvh);

	ctx.translate( //Pergelangan, sub Cabang 1A-1
                sendi.pergelanganL.x-sendi.sikuL.x,
                sendi.pergelanganL.y-sendi.sikuL.y);
        ctx.rotate((Math.PI/180) * sendi.pergelanganL.m);
        ctx.drawImage(jariL,-sendi.pergelanganL.x,-sendi.pergelanganL.y,
                canvas.width,canvh);
	ctx.restore();

	ctx.save(); //Bahu kanan, Sendi Cabang 2
        ctx.translate(
		sendi.bahuR.x-sendi.mainPoros.x,
                sendi.bahuR.y-sendi.mainPoros.y)
	ctx.rotate((Math.PI/180) * sendi.bahuR.m);
        ctx.drawImage(lenganR,-sendi.bahuR.x,-sendi.bahuR.y,
		canvas.width,canvh);

	ctx.translate( //Siku, sub Cabang 2A
                sendi.sikuR.x-sendi.bahuR.x,
		sendi.sikuR.y-sendi.bahuR.y);
        ctx.rotate((Math.PI/180) * sendi.sikuR.m);
        ctx.drawImage(tanganR,-sendi.sikuR.x,-sendi.sikuR.y,
                canvas.width,canvh);

	ctx.translate( //Pergelangan, sub Cabang 2A-1
		sendi.pergelanganR.x-sendi.sikuR.x,
		sendi.pergelanganR.y-sendi.sikuR.y);
	ctx.rotate((Math.PI/180) * sendi.pergelanganR.m);
        ctx.drawImage(jariR,-sendi.pergelanganR.x,-sendi.pergelanganR.y,
                canvas.width,canvh);
	ctx.restore();

	//pangkal leher, Sendi Cabang 3
        ctx.translate(
                sendi.pangkalLeher.x-sendi.mainPoros.x,
                sendi.pangkalLeher.y-sendi.mainPoros.y)
        ctx.rotate((Math.PI/180) * sendi.pangkalLeher.m);
	//leher, kepala/wajah, rambut layer 1
        ctx.drawImage(leher,-sendi.pangkalLeher.x,-sendi.pangkalLeher.y,
                canvas.width,canvh);
	ctx.drawImage(wajah,-sendi.pangkalLeher.x,-sendi.pangkalLeher.y,
                canvas.width,canvh);

	ctx.save(); // rambutAtas subCabang 3A
        ctx.translate(
                sendi.rambutAtas.x-sendi.pangkalLeher.x,
                sendi.rambutAtas.y-sendi.pangkalLeher.y)
        ctx.rotate((Math.PI/180) * sendi.rambutAtas.m);
        ctx.drawImage(rambutF,-sendi.rambutAtas.x,-sendi.rambutAtas.y,
                canvas.width,canvh);
	ctx.drawImage(rambutB,-sendi.rambutAtas.x,-sendi.rambutAtas.y,
                canvas.width,canvh);

	ctx.save(); // subCabang 3A-1
        ctx.translate(
                sendi.rambutL.x-sendi.rambutAtas.x,
                sendi.rambutL.y-sendi.rambutAtas.y)
        ctx.rotate((Math.PI/180) * sendi.rambutL.m);
        ctx.drawImage(rambutL,-sendi.rambutL.x,-sendi.rambutL.y,
                canvas.width,canvh);
        ctx.restore();

        ctx.translate(//sub cabang 3B-1
                sendi.rambutR.x-sendi.rambutAtas.x,
                sendi.rambutR.y-sendi.rambutAtas.y)
        ctx.rotate((Math.PI/180) * sendi.rambutR.m);
        ctx.drawImage(rambutR,-sendi.rambutR.x,-sendi.rambutR.y,
                canvas.width,canvh);
	ctx.restore();


	ctx.save(); // subCabang 3B
        ctx.translate(
                sendi.rambutL2.x-sendi.pangkalLeher.x,
                sendi.rambutL2.y-sendi.pangkalLeher.y)
        ctx.rotate((Math.PI/180) * sendi.rambutL2.m);
        ctx.drawImage(rambutFl,-sendi.rambutL2.x,-sendi.rambutL2.y,
                canvas.width,canvh);
	ctx.restore();


	ctx.translate(//sub cabang 3C
                sendi.rambutR2.x-sendi.pangkalLeher.x,
                sendi.rambutR2.y-sendi.pangkalLeher.y)
        ctx.rotate((Math.PI/180) * sendi.rambutR2.m);
        ctx.drawImage(rambutFr,-sendi.rambutR2.x,-sendi.rambutR2.y,
                canvas.width,canvh);
	ctx.restore();	
}
let bandul=(a,range)=>Math.abs((a%(range*2))-range)*2-range;

let durasiRambut = 1;
let durasiKepala = 1.5;
let durasiBadan = 2.5;
let durasiTangan = 0.6;
let durasiRambutPelan = 0.5;
let kondisiGlobal = false;

function gerakin(kondisi) {
	if (kondisi) {
		durasiRambut+=0.03;
		durasiBadan+=0.06;
		durasiKepala += 0.06;
		durasiTangan += 0.05;

		durasiPelan = 0.5;
	} else {
		// pokoknya gerak dulu, sampai lurus baru diam
		if (Math.abs(sendi.mainPoros.m) >0.1 ) durasiBadan+=0.06;
		else durasiBadan = 2.5;
		if (Math.abs(sendi.pangkalLeher.m)>0.1) durasiKepala+= 0.06;
		else durasiKepala = 1.5;
		if (Math.abs(sendi.rambutAtas.m) >0.1 ) durasiRambut+=0.03;
		else durasiRambut = 1;
		if (Math.abs(sendi.bahuL.m) >0.1 ) durasiTangan+=0.03;
                else durasiTangan += 0.001;

		durasiRambutPelan += 0.015;

	}
	sendi.mainPoros.m = bandul(durasiBadan,5);
        sendi.pangkalLeher.m = bandul(durasiKepala,3);

        sendi.rambutAtas.m = bandul(durasiRambut,2);
        sendi.rambutL2.m = sendi.rambutAtas.m*1.06;
        sendi.rambutR2.m = sendi.rambutAtas.m*1.06;
        sendi.rambutL.m = sendi.rambutAtas.m*1.009 || bandul(durasiRambutPelan,1);
        sendi.rambutR.m = sendi.rambutAtas.m*1.009 || bandul(durasiRambutPelan,1);

        sendi.bahuL.m = bandul(durasiTangan,1.2);
        sendi.bahuR.m = 1-bandul(durasiTangan,1.2);

        sendi.sikuL.m = sendi.bahuL.m*1.1;
        sendi.sikuR.m = sendi.bahuR.m*1.1;

        sendi.pergelanganL.m = sendi.bahuL.m*1.01;
        sendi.pergelanganR.m = sendi.bahuR.m*1.01;
}
let lastTime = 0;
let waktuTertinggal = 0;
const satuFrame = 1000/30;

function updateGambar(now){

   waktuTertinggal += now - lastTime;
   lastTime = now;

   while(waktuTertinggal >= satuFrame) {
      gerakin(kondisiGlobal);
      waktuTertinggal -= satuFrame;
   }
   
   drawAnimation();
   requestAnimationFrame(updateGambar);
}
requestAnimationFrame(updateGambar);
window.addEventListener("keydown", async (e) => {  
	let char = await getChar(e);
	if (char == "1") kondisiGlobal = true;
	if (char == "2") kondisiGlobal = false;

});

