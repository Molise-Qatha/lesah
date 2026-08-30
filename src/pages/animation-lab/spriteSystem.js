// LeSAH Animation Lab — Sprite System Foundation
// Lightweight sprite animation engine using DOM/CSS

export class Sprite {
  constructor({ id, src, width = 100, height = 100 }) {
    this.id = id;
    this.src = src;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scale = 1;
    this.opacity = 1;
    this.visible = true;
    this.expression = 'neutral';
    this.isTalking = false;
    this.isBlinking = false;
    this.isMoving = false;
    
    // Animation state
    this.animationQueue = [];
    this.currentAnimation = null;
    this.animationFrame = 0;
    this.animationSpeed = 1;
    this.onAnimationComplete = null;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  setRotation(degrees) {
    this.rotation = degrees;
    return this;
  }

  setScale(value) {
    this.scale = value;
    return this;
  }

  setOpacity(value) {
    this.opacity = value;
    return this;
  }

  setVisible(visible) {
    this.visible = visible;
    return this;
  }

  setExpression(expression) {
    this.expression = expression;
    return this;
  }

  blink() {
    this.isBlinking = true;
    setTimeout(() => { this.isBlinking = false; }, 150);
    return this;
  }

  talk(duration = 2000) {
    this.isTalking = true;
    setTimeout(() => { this.isTalking = false; }, duration);
    return this;
  }

  moveTo(targetX, targetY, duration = 2000, easing = 'linear') {
    const startX = this.x;
    const startY = this.y;
    const startTime = Date.now();
    
    this.isMoving = true;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing functions
      const eased = easing === 'easeInOut' 
        ? progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
        : easing === 'easeOut'
        ? 1 - Math.pow(1 - progress, 3)
        : progress;
      
      this.x = startX + (targetX - startX) * eased;
      this.y = startY + (targetY - startY) * eased;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isMoving = false;
        if (this.onAnimationComplete) this.onAnimationComplete();
      }
    };
    
    requestAnimationFrame(animate);
    return this;
  }

  fadeIn(duration = 1000) {
    this.opacity = 0;
    this.setVisible(true);
    const startTime = Date.now();
    
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      this.opacity = progress;
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    return this;
  }

  fadeOut(duration = 1000) {
    const startTime = Date.now();
    const startOpacity = this.opacity;
    
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      this.opacity = startOpacity * (1 - progress);
      if (progress < 1) requestAnimationFrame(animate);
      else this.setVisible(false);
    };
    
    requestAnimationFrame(animate);
    return this;
  }

  getTransform() {
    return `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg) scale(${this.scale})`;
  }

  getStyle() {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: `${this.width}px`,
      height: `${this.height}px`,
      transform: this.getTransform(),
      opacity: this.opacity,
      display: this.visible ? 'block' : 'none',
      transition: 'none',
    };
  }
}

export class Camera {
  constructor({ x = 0, y = 0, zoom = 1 }) {
    this.x = x;
    this.y = y;
    this.zoom = zoom;
    this.shakeIntensity = 0;
  }

  panTo(targetX, targetY, duration = 2000) {
    const startX = this.x;
    const startY = this.y;
    const startTime = Date.now();
    
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.x = startX + (targetX - startX) * eased;
      this.y = startY + (targetY - startY) * eased;
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    return this;
  }

  zoomTo(targetZoom, duration = 2000) {
    const startZoom = this.zoom;
    const startTime = Date.now();
    
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.zoom = startZoom + (targetZoom - startZoom) * eased;
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    return this;
  }

  shake(intensity = 5, duration = 300) {
    this.shakeIntensity = intensity;
    const startTime = Date.now();
    
    const animate = () => {
      const progress = (Date.now() - startTime) / duration;
      if (progress < 1) {
        this.x += (Math.random() - 0.5) * intensity;
        this.y += (Math.random() - 0.5) * intensity;
        requestAnimationFrame(animate);
      } else {
        this.shakeIntensity = 0;
      }
    };
    
    requestAnimationFrame(animate);
    return this;
  }

  applyTo(element) {
    element.style.transform = `translate(${-this.x}px, ${-this.y}px) scale(${this.zoom})`;
  }
}

export class AnimationStage {
  constructor(container) {
    this.container = container;
    this.sprites = [];
    this.camera = new Camera();
    this.layers = {
      sky: [],
      mountains: [],
      village: [],
      trees: [],
      ground: [],
      characters: [],
      foreground: [],
      effects: [],
    };
  }

  addSprite(sprite, layer = 'characters') {
    this.sprites.push(sprite);
    if (this.layers[layer]) {
      this.layers[layer].push(sprite);
    }
    return sprite;
  }

  removeSprite(sprite) {
    this.sprites = this.sprites.filter(s => s !== sprite);
    Object.keys(this.layers).forEach(key => {
      this.layers[key] = this.layers[key].filter(s => s !== sprite);
    });
  }

  getSprites() {
    return this.sprites;
  }

  getLayerSprites(layer) {
    return this.layers[layer] || [];
  }

  render() {
    // This will be called by the React component
    // to re-render all sprites
  }
}

export const EASING = {
  linear: 'linear',
  easeInOut: 'easeInOut',
  easeOut: 'easeOut',
  easeIn: 'easeIn',
};