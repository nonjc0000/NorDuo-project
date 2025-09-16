import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const FallingTags = () => {
  const containerRef = useRef();
  const engineRef = useRef();
  const runnerRef = useRef();
  const [elements, setElements] = useState([]);

  // 容器尺寸
  const CONTAINER_WIDTH = 1440;
  const CONTAINER_HEIGHT = 700;
  const WALL_THICKNESS = 60;

  useEffect(() => {
    // Matter.js 模組別名
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

    // 創建隱形渲染器（只用於物理運算，不顯示）
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

    // 隱藏 canvas（我們只用 DOM 元素顯示）
    render.canvas.style.display = 'none';

    // 創建邊界
    const ground = Bodies.rectangle(
      CONTAINER_WIDTH / 2, 
      CONTAINER_HEIGHT + WALL_THICKNESS / 2, 
      CONTAINER_WIDTH + WALL_THICKNESS * 2, 
      WALL_THICKNESS, 
      {
        isStatic: true,
        label: 'ground'
      }
    );

    const leftWall = Bodies.rectangle(
      -WALL_THICKNESS / 2, 
      CONTAINER_HEIGHT / 2, 
      WALL_THICKNESS, 
      CONTAINER_HEIGHT + WALL_THICKNESS * 2, 
      {
        isStatic: true,
        label: 'leftWall'
      }
    );

    const rightWall = Bodies.rectangle(
      CONTAINER_WIDTH + WALL_THICKNESS / 2, 
      CONTAINER_HEIGHT / 2, 
      WALL_THICKNESS, 
      CONTAINER_HEIGHT + WALL_THICKNESS * 2, 
      {
        isStatic: true,
        label: 'rightWall'
      }
    );

    const ceiling = Bodies.rectangle(
      CONTAINER_WIDTH / 2, 
      -WALL_THICKNESS / 2, 
      CONTAINER_WIDTH + WALL_THICKNESS * 2, 
      WALL_THICKNESS, 
      {
        isStatic: true,
        label: 'ceiling'
      }
    );

    // 創建 HTML 物理元素
    const htmlElements = [
      {
        id: 'Improvisation',
        body: Bodies.rectangle(230, 100, 315, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Improvisation',
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
          pointerEvents: 'auto', // 關鍵：讓元素可以接收事件
        }
      },
      {
        id: 'BE CREATIVE',
        body: Bodies.rectangle(600, 50, 285, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'BE CREATIVE',
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
        body: Bodies.rectangle(320, 80, 178, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Guitar',
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
        body: Bodies.rectangle(800, 30, 217, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Keyboard',
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
        body: Bodies.rectangle(1050, 60, 276, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Composition',
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
        body: Bodies.rectangle(400, 90, 198, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Harmony',
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
        body: Bodies.rectangle(700, 40, 139, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Bass',
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
        body: Bodies.rectangle(450, 70, 139, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Drum',
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
        body: Bodies.rectangle(900, 80, 158, 62, {
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01,
          density: 0.001,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Vocal',
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

    // 添加滑鼠控制 - 使用特殊的滑鼠設置
    const mouse = Mouse.create(containerRef.current);
    
    // 關鍵設置：讓滑鼠只對特定元素有效
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
          domElement.style.left = `${x - parseFloat(element.style.width) / 2}px`;
          domElement.style.top = `${y - parseFloat(element.style.height) / 2}px`;
          domElement.style.transform = `rotate(${angle}rad)`;
        }
      });

      requestAnimationFrame(animate);
    };
    animate();

    // 清理函數
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);

      if (render.canvas) {
        render.canvas.remove();
      }
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

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
        // 關鍵設置：容器本身不攔截指針事件
        pointerEvents: 'none',
      }}
    >
      {elements.map((element) => {
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
    </div>
  );
};

export default FallingTags;