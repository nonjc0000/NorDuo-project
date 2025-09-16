import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const FallingTags = () => {
  const containerRef = useRef();
  const engineRef = useRef();
  const runnerRef = useRef();
  const renderRef = useRef();
  const animationRef = useRef();
  const [elements, setElements] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [physicsStarted, setPhysicsStarted] = useState(false);

  // 容器尺寸
  const CONTAINER_WIDTH = 1440;
  const CONTAINER_HEIGHT = 700;
  const WALL_THICKNESS = 60;

  // 初始標籤數據
  const initialElements = [
    {
      id: 'Improvisation',
      content: 'Improvisation',
      width: 315,
      height: 62,
      x: 230,
      y: 100,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '315px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'BE CREATIVE',
      content: 'BE CREATIVE',
      width: 285,
      height: 62,
      x: 600,
      y: 50,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '285px',
        height: '62px',
        borderRadius: '999px',
        border: '5px solid #F18888',
        backgroundColor: 'transparent',
        color: '#F18888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Guitar',
      content: 'Guitar',
      width: 178,
      height: 62,
      x: 320,
      y: 80,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '178px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Keyboard',
      content: 'Keyboard',
      width: 217,
      height: 62,
      x: 800,
      y: 30,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '217px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Composition',
      content: 'Composition',
      width: 276,
      height: 62,
      x: 1050,
      y: 60,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '276px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Harmony',
      content: 'Harmony',
      width: 198,
      height: 62,
      x: 400,
      y: 90,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '198px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Bass',
      content: 'Bass',
      width: 139,
      height: 62,
      x: 700,
      y: 40,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '139px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Drum',
      content: 'Drum',
      width: 139,
      height: 62,
      x: 450,
      y: 70,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '139px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
    {
      id: 'Vocal',
      content: 'Vocal',
      width: 158,
      height: 62,
      x: 900,
      y: 80,
      style: {
        fontSize: '1.75rem',
        lineHeight: '150%',
        letterSpacing: '0.1em',
        width: '158px',
        height: '62px',
        borderRadius: '999px',
        backgroundColor: '#F18888',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
        pointerEvents: 'auto',
      }
    },
  ];

  // Intersection Observer 監聽可見性
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
      {
        threshold: 0.3, // 當 30% 可見時觸發
        rootMargin: '0px 0px -100px 0px' // 提前一點觸發
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [physicsStarted]);

  // 初始化物理引擎
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;

    // 創建引擎
    const engine = Engine.create();
    engineRef.current = engine;

    // 設置重力
    engine.world.gravity.y = 1;

    // 創建隱形渲染器
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        wireframes: false,
        background: 'transparent',
        showVelocity: false,
        showAngleIndicator: false,
        showDebug: false,
      },
    });
    renderRef.current = render;

    // 隱藏 canvas
    render.canvas.style.display = 'none';

    // 創建邊界
    const ground = Bodies.rectangle(
      CONTAINER_WIDTH / 2, 
      CONTAINER_HEIGHT + WALL_THICKNESS / 2, 
      CONTAINER_WIDTH + WALL_THICKNESS * 2, 
      WALL_THICKNESS, 
      { isStatic: true, label: 'ground' }
    );

    const leftWall = Bodies.rectangle(
      -WALL_THICKNESS / 2, 
      CONTAINER_HEIGHT / 2, 
      WALL_THICKNESS, 
      CONTAINER_HEIGHT + WALL_THICKNESS * 2, 
      { isStatic: true, label: 'leftWall' }
    );

    const rightWall = Bodies.rectangle(
      CONTAINER_WIDTH + WALL_THICKNESS / 2, 
      CONTAINER_HEIGHT / 2, 
      WALL_THICKNESS, 
      CONTAINER_HEIGHT + WALL_THICKNESS * 2, 
      { isStatic: true, label: 'rightWall' }
    );

    const ceiling = Bodies.rectangle(
      CONTAINER_WIDTH / 2, 
      -WALL_THICKNESS / 2, 
      CONTAINER_WIDTH + WALL_THICKNESS * 2, 
      WALL_THICKNESS, 
      { isStatic: true, label: 'ceiling' }
    );

    // 創建物理元素
    const htmlElements = initialElements.map(element => ({
      ...element,
      type: 'p',
      body: Bodies.rectangle(element.x, element.y, element.width, element.height, {
        restitution: 0.6,
        friction: 0.3,
        frictionAir: 0.01,
        density: 0.001,
        label: 'htmlText'
      })
    }));

    setElements(htmlElements);

    // 將所有物體加入世界
    const allBodies = [
      ground,
      leftWall,
      rightWall,
      ceiling,
      ...htmlElements.map(el => el.body)
    ];
    World.add(engine.world, allBodies);

    // 添加滑鼠控制
    const mouse = Mouse.create(containerRef.current);
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    
    World.add(engine.world, mouseConstraint);

    // 創建 runner
    const runner = Runner.create();
    runnerRef.current = runner;

    // 啟動物理引擎
    Runner.run(runner, engine);
    Render.run(render);

    // 動畫迴圈 - 同步 DOM 元素位置
    const animate = () => {
      htmlElements.forEach(element => {
        const { x, y } = element.body.position;
        const angle = element.body.angle;

        const domElement = document.getElementById(element.id);
        if (domElement) {
          domElement.style.position = 'absolute';
          domElement.style.left = `${x - element.width / 2}px`;
          domElement.style.top = `${y - element.height / 2}px`;
          domElement.style.transform = `rotate(${angle}rad)`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 清理函數
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
        renderRef.current.canvas = null;
        renderRef.current.context = null;
        renderRef.current.textures = {};
      }
      
      if (runnerRef.current && engineRef.current) {
        Runner.stop(runnerRef.current);
        World.clear(engineRef.current.world);
        Engine.clear(engineRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div 
      className="fallingTags"
      ref={containerRef}
      id="fallingTags"
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        border: '2px solid white',
        position: 'relative',
        margin: '0 auto',
        pointerEvents: 'none',
      }}
    >
      {/* 只有在物理啟動後才渲染元素 */}
      {physicsStarted && elements.map((element) => {
        const Tag = element.type;
        return (
          <Tag
            key={element.id}
            id={element.id}
            style={{
              position: 'absolute',
              ...element.style
            }}
          >
            {element.content}
          </Tag>
        );
      })}
      
      {/* 在物理效果啟動前顯示靜態內容 */}
      {!physicsStarted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.5rem',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          {/* 可以在這裡放一些預覽內容或載入提示 */}
        </div>
      )}
    </div>
  );
};

export default FallingTags;