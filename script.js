const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// mouse movement for parallax
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", e=>{
mouseX = e.clientX;
mouseY = e.clientY;
});
// star layers (depth)
let starsFar = [];
let starsMid = [];
let starsNear = [];
function createStars(arr,count,speed,size){
for(let i=0;i<count;i++){
arr.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*size,
speed:speed*Math.random(),
opacity:Math.random(),
twinkle:Math.random()*0.02
});
}
}
createStars(starsFar,700,0.03,1);
createStars(starsMid,400,0.05,1.5);
createStars(starsNear,200,0.08,2);
// milky way particles
let milkyWay=[];
for(let i=0;i<300;i++){
milkyWay.push({
x:Math.random()*canvas.width,
y:canvas.height/2 + (Math.random()*200-100),
size:Math.random()*2,
opacity:Math.random()*0.4
});
}
// draw stars
function drawStars(arr,parallax){
arr.forEach(star=>{
star.y += star.speed;
if(star.y>canvas.height){
star.y=0;
star.x=Math.random()*canvas.width;
}
star.opacity+=star.twinkle;
if(star.opacity>1 || star.opacity<0){
star.twinkle*=-1;
}
let px=star.x+(mouseX-canvas.width/2)*parallax;
let py=star.y+(mouseY-canvas.height/2)*parallax;
ctx.beginPath();
ctx.arc(px,py,star.size,0,Math.PI*2);
ctx.fillStyle="rgba(255,255,255,"+star.opacity+")";
ctx.fill();
});
}
// draw milky way
function drawMilkyWay(){
milkyWay.forEach(p=>{
ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fillStyle="rgba(180,200,255,"+p.opacity+")";
ctx.fill();
});
}
// animation
function animate(){
ctx.fillStyle="black";
ctx.fillRect(0,0,canvas.width,canvas.height);
drawMilkyWay();
drawStars(starsFar,0.01);
drawStars(starsMid,0.02);
drawStars(starsNear,0.04);
requestAnimationFrame(animate);
}
animate();
// meteors
function meteor(){
let x=Math.random()*canvas.width;
let y=0;
let length=120;
let speed=4;
let opacity=1;
function shoot(){
ctx.beginPath();
ctx.moveTo(x,y);
ctx.lineTo(x+length,y+length);
ctx.strokeStyle="rgba(255,255,255,"+opacity+")";
ctx.lineWidth=2;
ctx.stroke();
x+=speed;
y+=speed;
opacity-=0.015;
if(opacity>0){
requestAnimationFrame(shoot);
}
}
shoot();
}
setInterval(meteor,7000);
// constellation animation
const starsConst=document.querySelectorAll(".star");
const lines=document.querySelector(".dipper-lines");
window.addEventListener("scroll",()=>{
const trigger=document.querySelector(".constellation").offsetTop-400;
if(window.scrollY>trigger){
starsConst.forEach((star,i)=>{
setTimeout(()=>{
star.classList.add("visible");
},i*600);
});
setTimeout(()=>{
lines.classList.add("visible");
},3500);
}
});
// sound — fixed: audio element is #spaceAudio, not #spaceSound
const audioEl = document.getElementById("spaceAudio");

function toggleSound(btn) {
  if (audioEl.paused) {
    audioEl.play().catch(() => {});
    btn.textContent = "🔇 Mute Space Sound";
  } else {
    audioEl.pause();
    btn.textContent = "🔊 Enable Space Sound";
  }
}

document.getElementById("soundBtn").onclick = function() { toggleSound(this); };
document.getElementById("soundToggle").onclick = function() { toggleSound(this); };
// resize support
window.addEventListener("resize",()=>{
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
});