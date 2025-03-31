let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;  // Random initial rotation between -15 and 15 degrees
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Mouse move event handler for paper movement and rotation
    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          // Move the paper if not rotating
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        // Calculate the rotation angle when rotating
        if (this.rotating) {
          const dirX = e.clientX - this.mouseTouchX;
          const dirY = e.clientY - this.mouseTouchY;
          const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
          const dirNormalizedX = dirX / dirLength;
          const dirNormalizedY = dirY / dirLength;

          const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
          let degrees = (180 * angle) / Math.PI;
          degrees = (360 + Math.round(degrees)) % 360;
          this.rotation = degrees;
        }

        // Apply transformation to the paper (move and rotate)
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }

      // Update previous mouse position for next move
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    });

    // Mouse down event to start holding and rotating
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Record the mouse position for drag or rotation
      if (e.button === 0) { // Left click - Move paper
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }

      if (e.button === 2) { // Right click - Rotate paper
        this.rotating = true;
      }
    });

    // Mouse up event to stop holding and rotating
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Prevent right-click menu on paper element
    paper.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

// Initialize the papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
