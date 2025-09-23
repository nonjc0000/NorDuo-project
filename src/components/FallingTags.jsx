import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const FallingTags = () => {
  // Refs
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const animationRef = useRef(null);
  const wallRefs = useRef({ ground: null, left: null, right: null });
  const mouseConstraintRef = useRef(null);

  // State
  const [elements, setElements] = useState([]);
  const [physicsStarted, setPhysicsStarted] = useState(false);
  const [shouldRenderElements, setShouldRenderElements] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 1440, height: 700 });

  // Constants
  const WALL_THICKNESS = 60;
  const PHYSICS_CONFIG = {
    gravity: 1,
    restitution: 0.6,
    friction: 0.3,
    frictionAir: 0.02,
    density: 0.001,
    stiffness: 0.2
  };

  const INITIAL_ELEMENTS = [
    { id: 'Improvisation', content: 'Improvisation', width: 315, height: 62, x: 230,  y: -150, filled: true },
    { id: 'BE CREATIVE',  content: 'BE CREATIVE',  width: 285, height: 62, x: 720,  y: -200, filled: false },
    { id: 'Guitar',        content: 'Guitar',       width: 178, height: 62, x: 320,  y: -120, filled: true },
    { id: 'Keyboard',      content: 'Keyboard',     width: 217, height: 62, x: 1200, y: -250, filled: true },
    { id: 'Composition',   content: 'Composition',  width: 276, height: 62, x: 1050, y:  -80, filled: true },
    { id: 'Harmony',       content: 'Harmony',      width: 198, height: 62, x: 500,  y: -100, filled: true },
    { id: 'Bass',          content: 'Bass',         width: 139, height: 62, x: 900,  y: -220, filled: true },
    { id: 'Drum',          content: 'Drum',         width: 139, height: 62, x: 450,  y: -170, filled: true },
    { id: 'Vocal',         content: 'Vocal',        width: 158, height: 62, x: 1170, y: -130, filled: true },
  ];

  // Style generator
  const getPillStyle = (el) => ({
    fontSize: '1.75rem',
    lineHeight: '150%',
    letterSpacing: '0.1em',
    width: `${el.width}px`,
    height: `${el.height}px`,
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    position: 'absolute',
    zIndex: 5,
    opacity: physicsStarted ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    pointerEvents: 'none',
    ...(el.filled ? 
      { backgroundColor: '#F18888', color: 'white' } : 
      { backgroundColor: 'transparent', color: '#F18888', border: '5px solid #F18888' }
    )
  });

  // Container size handler
  const updateContainerSize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });
  }, []);

  // Wall management
  const rebuildWalls = useCallback(() => {
    if (!engineRef.current) return;
    
    const { World, Bodies } = Matter;
    const world = engineRef.current.world;
    const { width, height } = containerSize;
    const { ground, left, right } = wallRefs.current;

    // Remove old walls
    const toRemove = [ground, left, right].filter(Boolean);
    if (toRemove.length) World.remove(world, toRemove);

    // Create new walls
    const newWalls = {
      ground: Bodies.rectangle(
        width / 2, height + WALL_THICKNESS / 2,
        width + WALL_THICKNESS * 2, WALL_THICKNESS,
        { isStatic: true, label: 'ground' }
      ),
      left: Bodies.rectangle(
        -WALL_THICKNESS / 2, height / 2,
        WALL_THICKNESS, height + WALL_THICKNESS * 2 + 300,
        { isStatic: true, label: 'leftWall' }
      ),
      right: Bodies.rectangle(
        width + WALL_THICKNESS / 2, height / 2,
        WALL_THICKNESS, height + WALL_THICKNESS * 2 + 300,
        { isStatic: true, label: 'rightWall' }
      )
    };

    wallRefs.current = newWalls;
    World.add(world, Object.values(newWalls));
  }, [containerSize]);

  // Renderer sync
  const resizeRenderer = useCallback(() => {
    const render = renderRef.current;
    if (!render) return;
    
    const { width, height } = containerSize;
    render.options.width = width;
    render.options.height = height;
    
    if (render.canvas) {
      const ratio = window.devicePixelRatio || 1;
      render.canvas.width = Math.round(width * ratio);
      render.canvas.height = Math.round(height * ratio);
      Matter.Render.setPixelRatio(render, ratio);
    }
  }, [containerSize]);

  // Window resize listener
  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  // Container size changes
  useEffect(() => {
    if (physicsStarted) {
      rebuildWalls();
      resizeRenderer();
    }
  }, [physicsStarted, rebuildWalls, resizeRenderer]);

  // Intersection observer
  useEffect(() => {
    if (!containerRef.current || physicsStarted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setPhysicsStarted(true);
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [physicsStarted]);

  // Physics initialization
  useEffect(() => {
    if (!physicsStarted || !containerRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;
    const { width, height } = containerSize;

    // Setup engine
    const engine = Engine.create();
    engine.enableSleeping = true;
    engine.world.gravity.y = PHYSICS_CONFIG.gravity;
    engineRef.current = engine;

    // Setup renderer
    const render = Render.create({
      element: containerRef.current,
      engine,
      options: { width, height, wireframes: false, background: 'transparent' }
    });
    renderRef.current = render;
    render.canvas.style.display = 'none';
    Matter.Render.setPixelRatio(render, window.devicePixelRatio || 1);

    // Create walls
    rebuildWalls();

    // Create elements with physics bodies
    const scaleX = width / 1440;
    const htmlElements = INITIAL_ELEMENTS.map((el) => {
      const body = Bodies.rectangle(el.x * scaleX, el.y, el.width, el.height, {
        restitution: PHYSICS_CONFIG.restitution,
        friction: PHYSICS_CONFIG.friction,
        frictionAir: PHYSICS_CONFIG.frictionAir,
        density: PHYSICS_CONFIG.density,
        label: 'htmlText',
        chamfer: { radius: el.height / 2 }
      });
      return { ...el, type: 'p', body };
    });

    setElements(htmlElements);
    setTimeout(() => setShouldRenderElements(true), 100);

    // Add to world
    World.add(engine.world, [
      ...Object.values(wallRefs.current),
      ...htmlElements.map(el => el.body)
    ]);

    // Mouse constraint
    const mouse = Mouse.create(containerRef.current);
    ['mousewheel', 'DOMMouseScroll'].forEach(event => {
      mouse.element.removeEventListener(event, mouse.mousewheel);
    });

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: PHYSICS_CONFIG.stiffness, render: { visible: false } }
    });
    mouseConstraintRef.current = mouseConstraint;
    World.add(engine.world, mouseConstraint);

    // Start physics
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    // Animation loop
    const animate = () => {
      htmlElements.forEach(el => {
        const { x, y } = el.body.position;
        const dom = document.getElementById(el.id);
        if (dom) {
          dom.style.left = `${x - el.width / 2}px`;
          dom.style.top = `${y - el.height / 2}px`;
          dom.style.transform = `rotate(${el.body.angle}rad)`;
        }
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
          renderRef.current.canvas = null;
          renderRef.current.context = null;
          renderRef.current.textures = {};
        }
      }

      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
        if (mouseConstraintRef.current) {
          Matter.World.remove(engineRef.current.world, mouseConstraintRef.current);
        }
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [physicsStarted, containerSize, rebuildWalls]);

  return (
    <div
      className="fallingTags"
      ref={containerRef}
      id="fallingTags"
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {shouldRenderElements && elements.map((el) => {
        const Tag = el.type;
        return (
          <Tag key={el.id} id={el.id} style={getPillStyle(el)}>
            {el.content}
          </Tag>
        );
      })}
    </div>
  );
};

export default FallingTags;