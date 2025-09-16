import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const FallingTags = () => {
  const containerRef = useRef();
  const engineRef = useRef();
  const runnerRef = useRef();
  const renderRef = useRef();
  const animationRef = useRef();
  const groundRef = useRef();
  const leftWallRef = useRef();
  const rightWallRef = useRef();
  
  const [elements, setElements] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [physicsStarted, setPhysicsStarted] = useState(false);
  const [shouldRenderElements, setShouldRenderElements] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 1440, height: 700 });

  const WALL_THICKNESS = 60;

  // 初始標籤數據
  const initialElements = [
    {
      id: 'Improvisation',
      content: 'Improvisation',
      width: 315,
      height: 62,
      x: 230,
      y: -150,
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
      x: 720,
      y: -200,
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
      y: -120,
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
      x: 1200,
      y: -250,
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
      y: -80,
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
      x: 500,
      y: -100,
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
      x: 900,
      y: -220,
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
      y: -170,
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
      x: 1170,
      y: -130,
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

  // 獲取容器尺寸
  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  // 更新物理邊界
  const updatePhysicalBoundaries = useCallback(() => {
    if (!engineRef.current || !groundRef.current || !leftWallRef.useRef || !rightWallRef.current) {
      return;
    }

    const { Body } = Matter;
    const { width, height } = containerSize;

    // 更新地面位置和尺寸
    Body.setPosition(groundRef.current, {
      x: width / 2,
      y: height + WALL_THICKNESS / 2
    });
    Body.scale(groundRef.current, 
      (width + WALL_THICKNESS * 2) / groundRef.current.bounds.max.x - groundRef.current.bounds.min.x,
      1
    );

    // 更新左牆位置和尺寸
    Body.setPosition(leftWallRef.current, {
      x: -WALL_THICKNESS / 2,
      y: height / 2
    });
    Body.scale(leftWallRef.current, 
      1,
      (height + WALL_THICKNESS * 2 + 300) / (leftWallRef.current.bounds.max.y - leftWallRef.current.bounds.min.y)
    );

    // 更新右牆位置和尺寸
    Body.setPosition(rightWallRef.current, {
      x: width + WALL_THICKNESS / 2 - 110,
      y: height / 2
    });
    Body.scale(rightWallRef.current, 
      1,
      (height + WALL_THICKNESS * 2 + 300) / (rightWallRef.current.bounds.max.y - rightWallRef.current.bounds.min.y)
    );

    // 更新渲染器尺寸
    if (renderRef.current) {
      renderRef.current.options.width = width;
      renderRef.current.options.height = height;
      if (renderRef.current.canvas) {
        renderRef.current.canvas.width = width;
        renderRef.current.canvas.height = height;
      }
    }
  }, [containerSize, WALL_THICKNESS]);

  // 監聽視窗大小變化
  useEffect(() => {
    updateContainerSize();
    
    const handleResize = () => {
      updateContainerSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateContainerSize]);

  // 當容器尺寸變化時更新物理邊界
  useEffect(() => {
    if (physicsStarted) {
      updatePhysicalBoundaries();
    }
  }, [containerSize, physicsStarted, updatePhysicalBoundaries]);

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
        threshold: 0,
        rootMargin: '0px 0px -100px 0px'
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

    const { width, height } = containerSize;

    // 創建隱形渲染器
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
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

    // 創建邊界並保存引用
    const ground = Bodies.rectangle(
      width / 2, 
      height + WALL_THICKNESS / 2, 
      width + WALL_THICKNESS * 2, 
      WALL_THICKNESS, 
      { isStatic: true, label: 'ground' }
    );
    groundRef.current = ground;

    const leftWall = Bodies.rectangle(
      -WALL_THICKNESS / 2, 
      height / 2, 
      WALL_THICKNESS, 
      height + WALL_THICKNESS * 2 + 300,
      { isStatic: true, label: 'leftWall' }
    );
    leftWallRef.current = leftWall;

    const rightWall = Bodies.rectangle(
      width + WALL_THICKNESS / 2, 
      height / 2, 
      WALL_THICKNESS, 
      height + WALL_THICKNESS * 2 + 300,
      { isStatic: true, label: 'rightWall' }
    );
    rightWallRef.current = rightWall;

    // 創建物理元素
    const htmlElements = initialElements.map(element => ({
      ...element,
      type: 'p',
      body: Bodies.rectangle(
        element.x * (width / 1440), // 根據新尺寸調整初始位置
        element.y, 
        element.width, 
        element.height, 
        {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }
      )
    }));

    // 設定元素狀態
    setElements(htmlElements);
    
    setTimeout(() => {
      setShouldRenderElements(true);
    }, 100);

    // 將所有物體加入世界
    const allBodies = [
      ground,
      leftWall,
      rightWall,
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

    // 動畫迴圈
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
  }, [isVisible, containerSize]);

  return (
    <div 
      className="fallingTags"
      ref={containerRef}
      id="fallingTags"
      style={{ width: '100%', height: '100%' }}
    >
      {shouldRenderElements && elements.map((element) => {
        const Tag = element.type;
        return (
          <Tag
            key={element.id}
            id={element.id}
            style={{
              position: 'absolute',
              ...element.style,
              zIndex: 5,
              opacity: physicsStarted ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {element.content}
          </Tag>
        );
      })}
    </div>
  );
};

export default FallingTags;