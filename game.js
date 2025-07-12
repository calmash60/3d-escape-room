let hasKey = false;

window.addEventListener('DOMContentLoaded', () => {
  const key = document.querySelector('#key');
  const door = document.querySelector('#door');
  const msg = document.getElementById('message');
  const camera = document.getElementById('camera');

  // Key and door logic
  key.addEventListener('click', () => {
    if (!hasKey) {
      hasKey = true;
      key.setAttribute('visible', 'false');
      msg.textContent = "You found the key! Now escape through the door!";
      msg.style.background = "rgba(34,139,34,0.8)";
    }
  });

  door.addEventListener('click', () => {
    if (hasKey) {
      msg.textContent = "Congratulations! You escaped! 🎉";
      msg.style.background = "rgba(70,130,180,0.9)";
    } else {
      msg.textContent = "The door is locked. Find the key!";
      msg.style.background = "rgba(139,0,0,0.8)";
    }
  });

  // --- Mobile Controls Implementation ---

  // Joystick movement variables
  let moving = false, joyStart = {x:0, y:0}, joyPos = {x:0, y:0};
  let joyBase = document.getElementById('joystick-base');
  let joyKnob = document.getElementById('joystick-knob');
  let moveVector = {x:0, y:0};
  let lastMove = Date.now();

  function setKnob(x, y) {
    let baseSize = joyBase.offsetWidth;
    let r = baseSize/2 - 20/2;
    let dx = Math.max(-r, Math.min(r, x));
    let dy = Math.max(-r, Math.min(r, y));
    joyKnob.style.left = 40 + dx + 'px';
    joyKnob.style.top = 40 + dy + 'px';
  }

  function resetKnob() {
    setKnob(0,0);
    moveVector.x = 0;
    moveVector.y = 0;
  }

  joyBase.addEventListener('touchstart', function(e){
    moving = true;
    let rect = joyBase.getBoundingClientRect();
    joyStart.x = e.touches[0].clientX - rect.left - 50;
    joyStart.y = e.touches[0].clientY - rect.top - 50;
    setKnob(0,0);
    e.preventDefault();
  });

  joyBase.addEventListener('touchmove', function(e){
    if(!moving) return;
    let rect = joyBase.getBoundingClientRect();
    let dx = e.touches[0].clientX - rect.left - 50;
    let dy = e.touches[0].clientY - rect.top - 50;
    setKnob(dx, dy);

    // Normalize to -1 to 1
    moveVector.x = Math.max(-1, Math.min(1, dx/40));
    moveVector.y = Math.max(-1, Math.min(1, dy/40));
    e.preventDefault();
  });

  joyBase.addEventListener('touchend', function(){
    moving = false;
    resetKnob();
  });

  // Movement update loop
  function mobileMoveLoop() {
    let now = Date.now();
    if (moveVector.x !== 0 || moveVector.y !== 0) {
      // Move camera entity
      let moveSpeed = 0.05;
      let theta = THREE.Math.degToRad(camera.getAttribute('rotation').y);
      // Forward/back
      camera.object3D.position.x -= Math.sin(theta) * moveVector.y * moveSpeed;
      camera.object3D.position.z -= Math.cos(theta) * moveVector.y * moveSpeed;
      // Strafe
      camera.object3D.position.x += Math.cos(theta) * moveVector.x * moveSpeed;
      camera.object3D.position.z -= Math.sin(theta) * moveVector.x * moveSpeed;
    }
    requestAnimationFrame(mobileMoveLoop);
  }
  mobileMoveLoop();

  // Look controls with buttons
  function adjustLook(dx, dy) {
    let rot = camera.getAttribute('rotation');
    rot.y += dx;
    rot.x += dy;
    rot.x = Math.max(-80, Math.min(80, rot.x));
    camera.setAttribute('rotation', `${rot.x} ${rot.y} 0`);
  }

  document.getElementById('look-left').addEventListener('touchstart', e => { adjustLook(-10,0); e.preventDefault(); });
  document.getElementById('look-right').addEventListener('touchstart', e => { adjustLook(10,0); e.preventDefault(); });
  document.getElementById('look-up').addEventListener('touchstart', e => { adjustLook(0,-10); e.preventDefault(); });
  document.getElementById('look-down').addEventListener('touchstart', e => { adjustLook(0,10); e.preventDefault(); });

  // Show controls only on mobile
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  if (!isMobile()) {
    document.getElementById('mobile-controls').style.display = 'none';
  }
});
