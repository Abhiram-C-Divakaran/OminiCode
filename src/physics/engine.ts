/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Matter from 'matter-js';

export interface PhysicsConfig {
  enabled: boolean;
  gravityType: 'zero' | 'moon' | 'earth' | 'jupiter' | 'reverse' | 'wind';
  slowMotion: boolean;
  magneticMode: boolean;
  elasticity: number; // restitution
  friction: number;
}

export class AntigravityEngine {
  public engine: Matter.Engine;
  public runner: Matter.Runner | null = null;
  public boundaryBodies: Matter.Body[] = [];
  public elementBodiesMap = new Map<HTMLElement, Matter.Body>();
  public isRunning = false;
  
  // Settings
  public config: PhysicsConfig = {
    enabled: false,
    gravityType: 'earth',
    slowMotion: false,
    magneticMode: false,
    elasticity: 0.4,
    friction: 0.1,
  };

  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mouseConstraint: Matter.MouseConstraint | null = null;
  private onUpdateCallback: (() => void) | null = null;

  constructor() {
    this.engine = Matter.Engine.create({
      enableSleeping: false,
    });
    this.setGravity('earth');
  }

  // Set gravity configuration
  public setGravity(type: PhysicsConfig['gravityType']) {
    this.config.gravityType = type;
    const g = this.engine.gravity;
    g.x = 0;
    g.y = 0;

    switch (type) {
      case 'zero':
        g.y = 0;
        break;
      case 'moon':
        g.y = 0.16;
        break;
      case 'earth':
        g.y = 1.0;
        break;
      case 'jupiter':
        g.y = 2.5;
        break;
      case 'reverse':
        g.y = -1.0;
        break;
      case 'wind':
        g.y = 0.3;
        g.x = 0.5; // blows to the right
        break;
    }
  }

  // Initialize boundary walls around viewport
  public createBoundaries() {
    // Clear old boundaries
    if (this.boundaryBodies.length > 0) {
      Matter.Composite.remove(this.engine.world, this.boundaryBodies);
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const thickness = 100;

    const options = {
      isStatic: true,
      restitution: this.config.elasticity,
      friction: this.config.friction,
    };

    // Create 4 walls outside the viewport
    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + 200, thickness, options);
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2, width + 200, thickness, options);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + 200, options);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + 200, options);

    this.boundaryBodies = [ground, ceiling, leftWall, rightWall];
    Matter.Composite.add(this.engine.world, this.boundaryBodies);
  }

  // Apply general settings
  public updateSettings(updates: Partial<PhysicsConfig>) {
    this.config = { ...this.config, ...updates };
    
    if (updates.gravityType) {
      this.setGravity(updates.gravityType);
    }

    // Apply elasticity/friction to all non-static bodies
    const restitution = this.config.elasticity;
    const friction = this.config.friction;

    this.elementBodiesMap.forEach(body => {
      Matter.Body.set(body, { restitution, friction });
    });

    this.boundaryBodies.forEach(body => {
      Matter.Body.set(body, { restitution, friction });
    });
  }

  // Add a DOM element into the physics simulation
  public registerElement(el: HTMLElement, category = 'default') {
    if (this.elementBodiesMap.has(el)) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Create matter.js body center
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const densityMap: Record<string, number> = {
      header: 0.005,
      sidebar: 0.003,
      panel: 0.002,
      button: 0.008,
      card: 0.004,
      default: 0.004,
    };

    const density = densityMap[category] || 0.004;

    const body = Matter.Bodies.rectangle(x, y, rect.width, rect.height, {
      restitution: this.config.elasticity,
      friction: this.config.friction,
      frictionAir: 0.02,
      density,
      label: category,
      plugin: { el, originalRect: rect }
    });

    // Make elements fully interactive
    el.style.position = 'fixed';
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.zIndex = '50';
    el.style.transformOrigin = 'center center';
    el.style.pointerEvents = 'auto'; // ensure inputs/buttons still click

    Matter.Composite.add(this.engine.world, body);
    this.elementBodiesMap.set(el, body);
  }

  // Start gravity animation loop
  public start(onUpdate?: () => void) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.onUpdateCallback = onUpdate || null;

    // Build borders
    this.createBoundaries();

    // Setup resize listener
    this.resizeObserver = new ResizeObserver(() => {
      this.createBoundaries();
    });
    this.resizeObserver.observe(document.body);

    // Setup mouse constraints for dragging elements
    this.setupMouseDrag();

    // Primary requestAnimationFrame loop for ultra smooth 60 FPS update rendering
    let lastTime = performance.now();
    const run = (time: number) => {
      if (!this.isRunning) return;

      let delta = time - lastTime;
      if (delta > 100) delta = 16.66; // protect from tab-switch freezes
      lastTime = time;

      // Handle slow-motion coefficient
      const simDelta = this.config.slowMotion ? delta / 4 : delta;

      // Step physics engine
      Matter.Engine.update(this.engine, simDelta);

      // Handle magnetic force to center or other effects
      if (this.config.magneticMode) {
        this.applyMagneticAttraction();
      }

      // Synchronize DOM elements to their Matter.js physics counterparts
      this.syncDOM();

      if (this.onUpdateCallback) {
        this.onUpdateCallback();
      }

      this.animationFrameId = requestAnimationFrame(run);
    };

    this.animationFrameId = requestAnimationFrame(run);
  }

  // Apply subtle magnetic attraction toward screen center
  private applyMagneticAttraction() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    this.elementBodiesMap.forEach(body => {
      const dx = cx - body.position.x;
      const dy = cy - body.position.y;
      const forceStrength = 0.00012; // soft force
      
      Matter.Body.applyForce(body, body.position, {
        x: dx * forceStrength * body.mass,
        y: dy * forceStrength * body.mass
      });
    });
  }

  // Synchronize Matter.js engine positions to matching hardware-accelerated CSS transforms
  private syncDOM() {
    this.elementBodiesMap.forEach((body, el) => {
      const rect = body.plugin.originalRect;
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;

      // Centered translation coordinates
      const tx = body.position.x - halfW;
      const ty = body.position.y - halfH;

      // Apply GPU accelerated translate3d with rotations
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px) rotate(${body.angle.toFixed(4)}rad)`;
    });
  }

  // Setup drag behavior to grab any visible element
  private setupMouseDrag() {
    const canvas = document.createElement('canvas'); // Matter.js needs a dummy canvas for cursor coordinate mapping
    const mouse = Matter.Mouse.create(document.body);
    
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.Composite.add(this.engine.world, this.mouseConstraint);
  }

  // Blast / Explosion effect at coordinate (X, Y)
  public triggerExplosion(x: number, y: number, force = 0.4) {
    this.elementBodiesMap.forEach(body => {
      const dx = body.position.x - x;
      const dy = body.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      // Exponential radial dropoff
      if (distance < 500) {
        const strength = (1 - distance / 500) * force;
        const angle = Math.atan2(dy, dx);
        
        Matter.Body.applyForce(body, body.position, {
          x: Math.cos(angle) * strength * body.mass * 0.15,
          y: Math.sin(angle) * strength * body.mass * 0.15
        });

        // Add random spinning torque to make impacts chaotic and fun
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * strength * 2);
      }
    });
  }

  // Apply a chaotic random force to every body
  public triggerRandomImpulse() {
    this.elementBodiesMap.forEach(body => {
      const angle = Math.random() * Math.PI * 2;
      const forceStrength = 0.05 + Math.random() * 0.1;
      
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * forceStrength * body.mass,
        y: Math.sin(angle) * forceStrength * body.mass
      });

      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 1.5);
    });
  }

  // Freeze / Hold all bodies in place
  public freezeAll(freeze: boolean) {
    this.elementBodiesMap.forEach(body => {
      Matter.Body.setStatic(body, freeze);
    });
  }

  // Reset and revert DOM layout
  public reset() {
    this.isRunning = false;

    // Cancel animation loops
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Reset styles on all physical elements
    this.elementBodiesMap.forEach((body, el) => {
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
      el.style.width = '';
      el.style.height = '';
      el.style.zIndex = '';
      el.style.transform = '';
      el.style.transformOrigin = '';
    });

    // Clear matter engine world composites
    Matter.World.clear(this.engine.world, false);
    Matter.Engine.clear(this.engine);
    this.elementBodiesMap.clear();
    this.boundaryBodies = [];
  }
}
