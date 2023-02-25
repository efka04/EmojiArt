//This example both starts
//and pauses a sound sample
//when the user clicks the canvas

//We will store the p5.MediaElement
//object in here
let ele;

//while our audio is playing,
//this will be set to true
let sampleIsPlaying = false;


function mouseClicked() {
  //here we test if the mouse is over the
  //canvas element when it's clicked
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    background(200);

    if (sampleIsPlaying) {
      //Calling pause() on our
      //p5.MediaElement will stop it
      //playing, but when we call the
      //loop() or play() functions
      //the sample will start from
      //where we paused it.
      video.pause();

      sampleIsPlaying = false;
      text('Click to resume!', width / 2, height / 2);
    } else {
      //loop our sound element until we
      //call ele.pause() on it.
      video.loop();

      sampleIsPlaying = true;
      text('Click to pause!', width / 2, height / 2);
    }
  }
}
