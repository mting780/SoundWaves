var mic;
var fft;
var permanent;
var screen_divide;
var line_color;
var permanent_vol;
var permanent_amp;
var perm_sections;
var current;
var info_screen;

function setup() {
  createCanvas(screen.width,screen.height);
    mic = new p5.AudioIn();
  fft = new p5.FFT(0,1024);
  resetSketch();
  info_screen = true;

  var button = createButton('Reset');
  button.mousePressed(resetSketch);
  
  var button = createButton('Save and Finish');
  button.mousePressed(saveSketch);
}

function saveSketch(){
  noLoop();
  save("output.png");
}

function resetSketch() {
  loop();
  mic.start();
  fft.setInput(mic);
  frameRate(15);
  colorMode(HSB);
  screen_divide = .5;
  current = 0;
  permanent_vol = [];
  permanent_amp = [];
  permanent = [];
}

function draw() {
  clear();
  volume = mic.getLevel();
  var spectrum = fft.analyze(); 


  var amp_spectrum = fft.waveform();
  if (info_screen === false){
    append(permanent_vol,volume);
    mapPermanent(spectrum,amp_spectrum);
    drawLines(spectrum);
  };
  
  if (info_screen === true){
    draw_infoScreen();
  }
  
}

function draw_infoScreen(){
  fill(0,0,0,.5);
  rect(0,0,width,height);
  fill('black');
  textSize(24);
  textAlign(CENTER);
  text("Press enter, then say something.",width/2,height/2)
}

function mapPermanent(arr,amp) {
  x = map(arr[current],0, 256, 0,height);
  y = map(amp[current],-1,1,0,255);
  append(permanent,x);
  append(permanent_amp,y)
  current++;
}

function drawLines(arr){
  midpoint = height * screen_divide;
  strokeWeight(2);
  for (var k = 0; k < permanent.length;k++){
    lineHeight = permanent[k];
    lineHeight_half = lineHeight*.5;
    
    pt1 = midpoint+lineHeight_half;
    pt2 = midpoint-lineHeight_half;
    
    // wraparound(k,arr);
    x_pos = map(k,0,permanent.length,0,width)
    stroke(permanent_vol[k]*255,255,255);
    line((x_pos),pt1,(x_pos),pt2);
  }
}

function keyPressed() {
  if (keyCode == ENTER) {
    info_screen = false;
  }
}

// function wraparound(line_x,spectrum){
//   if (line_x == width) {
//     screen_divide+=1/20;
//     endShape();
//     return true;
//   }
//   if (screen_divide >= 1) {
//     screen_divide = 1/20;
//     save("output.png");
//     return;

//   }
//   return false;
// }