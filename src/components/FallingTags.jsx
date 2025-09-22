// FallingTags.jsx  — 修正版（JS 版）
// 重點：rebuildWalls() 取代 Body.scale；enableSleeping；pill 用 chamfer；完整清理

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const FallingTags = () => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const animationRef = useRef(null);

  // 牆體參考
  const groundRef = useRef(null);
  const leftWallRef = useRef(null);
  const rightWallRef = useRef(null);
  const mouseConstraintRef = useRef(null);

  const [elements, setElements] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [physicsStarted, setPhysicsStarted] = useState(false);
  const [shouldRenderElements, setShouldRenderElements] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 1440, height: 700 });

  const WALL_THICKNESS = 60;

  // 初始標籤數據（維持你的視覺樣式）
  const initialElements = [
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

  // 統一產生 pill 的 style（實心/線框）
  const pillStyle = (el) => ({
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
    pointerEvents: 'auto',
    backgroundColor: el.filled ? '#F18888' : 'transparent',
    color: el.filled ? 'white' : '#F18888',
    border: el.filled ? 'none' : '5px solid #F18888',
  });

  // 取得容器尺寸
  const updateContainerSize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });
  }, []);

  // 用「移除舊牆 + 建新牆」來 resize，避免 Body.scale 疊加誤差
  const rebuildWalls = useCallback(() => {
    if (!engineRef.current) return;
    const { World, Bodies } = Matter;
    const world = engineRef.current.world;
    const { width, height } = containerSize;

    // 先移除舊牆
    const toRemove = [groundRef.current, leftWallRef.current, rightWallRef.current].filter(Boolean);
    if (toRemove.length) World.remove(world, toRemove);

    // 大牆（稍微超過畫面，避免穿出）
    const ground = Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2,
      width + WALL_THICKNESS * 2,
      WALL_THICKNESS,
      { isStatic: true, label: 'ground' }
    );
    const leftWall = Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height + WALL_THICKNESS * 2 + 300,
      { isStatic: true, label: 'leftWall' }
    );
    const rightWall = Bodies.rectangle(
      width + WALL_THICKNESS / 2, // 移除 -110 魔數
      height / 2,
      WALL_THICKNESS,
      height + WALL_THICKNESS * 2 + 300,
      { isStatic: true, label: 'rightWall' }
    );

    groundRef.current = ground;
    leftWallRef.current = leftWall;
    rightWallRef.current = rightWall;
    World.add(world, [ground, leftWall, rightWall]);
  }, [containerSize]);

  // 同步（隱形）渲染器尺寸（若未來要開啟 debug，不會糊）
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

  // 視窗 resize
  useEffect(() => {
    updateContainerSize();
    const onResize = () => updateContainerSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateContainerSize]);

  // 容器尺寸變更 → 重建牆 & 渲染器同步
  useEffect(() => {
    if (!physicsStarted) return;
    rebuildWalls();
    resizeRenderer();
  }, [physicsStarted, rebuildWalls, resizeRenderer]);

  // 進入視口才啟動物理
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !physicsStarted) {
            setIsVisible(true);
            setPhysicsStarted(true);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [physicsStarted]);

  // 初始化物理引擎
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

    // 引擎＋sleeping
    const engine = Engine.create();
    engine.enableSleeping = true;            // ✅ 讓靜止剛體休眠
    engine.world.gravity.y = 1;
    engineRef.current = engine;

    const { width, height } = containerSize;

    // 隱形渲染器（只為了跑更新；canvas 隱藏）
    const render = Render.create({
      element: containerRef.current,
      engine,
      options: {
        width, height,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;
    render.canvas.style.display = 'none';
    Matter.Render.setPixelRatio(render, window.devicePixelRatio || 1);

    // 先建牆
    rebuildWalls();

    // 依容器寬度換算初始 x（沿用你的做法）
    const scaleX = width / 1440;

    // 產生「膠囊感」的剛體（chamfer 令碰撞更貼視覺）
    const htmlElements = initialElements.map((el) => {
      const body = Bodies.rectangle(
        el.x * scaleX,
        el.y,
        el.width,
        el.height,
        {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.02,
          density: 0.001,
          label: 'htmlText',
          chamfer: { radius: el.height / 2 }, // ✅ 圓角矩形
        }
      );
      return { ...el, type: 'p', style: pillStyle(el), body };
    });

    setElements(htmlElements);
    setTimeout(() => setShouldRenderElements(true), 100);

    World.add(engine.world, [
      groundRef.current, leftWallRef.current, rightWallRef.current,
      ...htmlElements.map((el) => el.body),
    ]);

    // 滑鼠拖曳（必要時，把 DOM pill 設 pointer-events:none，避免搶事件）
    const mouse = Mouse.create(containerRef.current);
    // 移除 mousewheel 綁定（避免影響頁面滾動）
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    mouseConstraintRef.current = mouseConstraint;
    World.add(engine.world, mouseConstraint);

    // 跑起來
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    // 把剛體位姿套到 DOM
    const animate = () => {
      for (const el of htmlElements) {
        const { x, y } = el.body.position;
        const angle = el.body.angle;
        const dom = document.getElementById(el.id);
        if (dom) {
          dom.style.position = 'absolute';
          dom.style.left = `${x - el.width / 2}px`;
          dom.style.top = `${y - el.height / 2}px`;
          dom.style.transform = `rotate(${angle}rad)`;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 清理
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) renderRef.current.canvas.remove();
        renderRef.current.canvas = null;
        renderRef.current.context = null;
        renderRef.current.textures = {};
      }

      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
        if (mouseConstraintRef.current) {
          Matter.World.remove(engineRef.current.world, mouseConstraintRef.current); // ✅ 移除滑鼠約束
        }
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, [isVisible, containerSize, rebuildWalls]);

  return (
    <div
      className="fallingTags"
      ref={containerRef}
      id="fallingTags"
      style={{ width: '100%', height: '100%', position: 'relative' }} // ✅ 讓絕對定位以此為基準
    >
      {shouldRenderElements && elements.map((el) => {
        const Tag = el.type;
        return (
          <Tag
            key={el.id}
            id={el.id}
            style={{
              position: 'absolute',
              ...el.style,
              zIndex: 5,
              opacity: physicsStarted ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              // 若要把拖曳完全交給 Matter，取消下一行以避免事件競爭：
              pointerEvents: 'none', 
            }}
          >
            {el.content}
          </Tag>
        );
      })}
    </div>
  );
};

export default FallingTags;
