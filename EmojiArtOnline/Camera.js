// variables------
//let switchFlag = false;
let slider;
let video;
let asciiDiv;
const emojiHexadecimal = [];
const getAvgHex = (color, total) => {
  const hex = Math.round(color / total).toString(16);
  return hex.length === 2 ? hex : '0' + hex;
};

// --------

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

//Convert RGB values to Hexadecimal -
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//Find the Distance between 2 colors (in RGB) --------------------
function distance(a, b) {
    return Math.sqrt(((a.r - b.r) ** 2) + ((a.g - b.g) ** 2) + ((a.b - b.b) ** 2));

}

//Convert headecimal values to RGB -
function hexToRgb(hex) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

//Compare pixels colors with emoji list color -
function nearestColor(colorHex) {
  let lowest = Number.POSITIVE_INFINITY;
  let index = 0;
  for (let i = 0; i < emojiHexadecimal.length; i++) {
    const tmp = distance(hexToRgb(colorHex), emojiHexadecimal[i]);
    if (tmp < lowest) {
      lowest = tmp;
      index = i;
    }
  }
  return emoji[index];
}

//- SETUP -

function setup(){

  let switchBtn;
  const options = {
       video: {
           facingMode: {
            exact: "user"  }
  } };
  noCanvas();
  video = createCapture(options, VIDEO);
  video.size(540,960); //9:16
  asciiDiv = createDiv();
  asciiDiv.parent("screen");
  asciiDiv.style('background-color', 'black');
  asciiDiv.style('text-align', 'center');
  asciiDiv.style('font-size', '7px');
  asciiDiv.style('line-height', '7px');

  background(200);
  textAlign(CENTER);
  text('Click to play!', width / 2, height / 2);

  const emojiLength = emoji.length;

  for(let j = 0; j < emojiLength; j++ )
  {
    let totalPixels = 0;
    const colors = {
              red: 0,
              green: 0,
              blue: 0,
            };
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        //transform emoji to picture of 10x10 pixels
        ctx.fillText(emoji[j], 0, 10);
        const { data: imageData } = ctx.getImageData(0, 0, 10, 10);
        //take all pixels of the picture and make an average color
        for (let i = 0; i < imageData.length; i += 8) {
          let [r, g, b, a] = imageData.slice(i, i + 8);
          if (a > 50) {
            totalPixels += 1;
            colors.red += r;
            colors.green += g;
            colors.blue += b;
          }
        }
        const r = getAvgHex(colors.red, totalPixels);
        const g = getAvgHex(colors.green, totalPixels);
        const b = getAvgHex(colors.blue, totalPixels);
        emojiHexadecimal[j] = hexToRgb(r+g+b);//store rgb value in an array

        //reset Values of the emoji
        totalPixels = 0;
        colors.red = 0;
        colors.green = 0;
        colors.blue = 0;
        }
        //Slider
          colorMode(HSB);
          slider = createSlider(10, 30, 20, 2);
          slider.position(10, 15);
          slider.style('width', '300px');
        //Button
          switchBtn = createButton('Switch Camera');
          switchBtn.position(10, 40);
          switchBtn.style('font-size', '50px');
          switchBtn.mousePressed(switchCamera);
}

//----------
function switchCamera()
{
  const options = {
       video: {
           facingMode: {
            exact: "user"  }
  } };
  switchFlag = !switchFlag;
  if(switchFlag==true)
  {
   video.remove();
   options = {
     video: {
         facingMode: {
          exact: "environment"  }
     }};}
  else
  {
   video.remove();
   options = {
     video: {
         facingMode: {
          exact: "user"}
        } };}
  video = createCapture(options, VIDEO);
  video.size(540,960); //9:16
}

//---------
function draw(){
  background(255,0,0);
  video.loadPixels();

  let val = slider.value();
  let currentFont = (Math.exp(val*0.1)+5);
  asciiDiv.style('font-size', parseInt(currentFont) + 'px');
  asciiDiv.style('line-height', parseInt(currentFont) + 'px');

let asciiImage = ''; // emojis are stored here
const videoHeight = video.height;
const videoWidth = video.width;
// for every 3 pixels of the video
for (let j = 0; j < videoHeight; j = j + val){
  for (let i = 0; i < videoWidth ; i = i + val){
      // 1- find the pixel index
      const pixelIndex = (i + j * videoWidth) * 4;
      // 2- store every colors into 3 variables
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      // 3- find the average color
      const avg = (r + g + b)/3;
      const len = emoji.length;
      const charIndex = floor(map(avg,0,255,len,0));
      //4 - transform 3 rgb variables into one hexadecimal value
      const hex = rgbToHex(r, g, b);
      //5 - store into c the nearest color --> return an emoji from the list
      const c = nearestColor(hex); // return emoji[i]
    asciiImage = asciiImage + c; //add each emojis to the line
    }
    asciiImage += '<br/>' // one the line is over make a line jump
  }//loop end
    asciiDiv.html(asciiImage);
}//draw End
// ------------
