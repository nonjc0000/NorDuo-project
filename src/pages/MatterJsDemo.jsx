import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const HtmlPhysicsDemo = () => {
  const containerRef = useRef();
  const engineRef = useRef();
  const runnerRef = useRef();
  const [elements, setElements] = useState([]);

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

    // 創建隱形渲染器（只用於物理運算，不顯示）
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: true,
        background: 'transparent',
        showVelocity: false,
        showAngleIndicator: false,
      },
    });

    // 隱藏 canvas（我們只用 DOM 元素顯示）
    render.canvas.style.display = 'none';

    // 創建邊界
    const ground = Bodies.rectangle(400, 600, 800, 20, {
      isStatic: true,
      label: 'ground'
    });
    const leftWall = Bodies.rectangle(10, 300, 20, 600, {
      isStatic: true,
      label: 'wall'
    });
    const rightWall = Bodies.rectangle(790, 300, 20, 600, {
      isStatic: true,
      label: 'wall'
    });

    // 創建一些 HTML 物理元素
    const htmlElements = [
      {
        id: 'Improvisation',
        body: Bodies.rectangle(200, 100, 80, 80, {
          restitution: 0.8,
          friction: 0.3,
          label: 'htmlBox'
        }),
        type: 'div',
        content: 'Improvisation',
        style: {
          width: '80px',
          height: '80px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          borderRadius: '8px',
          cursor: 'grab',
          userSelect: 'none',
        }
      },
      {
        id: 'text1',
        body: Bodies.rectangle(300, 50, 120, 40, {
          restitution: 0.6,
          friction: 0.5,
          label: 'htmlText'
        }),
        type: 'p',
        content: 'Hello Physics!',
        style: {
          width: '120px',
          height: '40px',
          backgroundColor: '#4ecdc4',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0',
          padding: '0',
          borderRadius: '20px',
          fontWeight: 'bold',
          cursor: 'grab',
          userSelect: 'none',
        }
      },
      {
        id: 'button1',
        body: Bodies.rectangle(500, 80, 100, 50, {
          restitution: 0.9,
          friction: 0.2,
          label: 'htmlButton'
        }),
        type: 'button',
        content: 'Click Me!',
        style: {
          width: '100px',
          height: '50px',
          backgroundColor: '#45b7d1',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }
      },
      {
        id: 'circle1',
        body: Bodies.circle(150, 30, 30, {
          restitution: 1.0,
          friction: 0.1,
          label: 'htmlCircle'
        }),
        type: 'div',
        content: '⚽',
        style: {
          width: '60px',
          height: '60px',
          backgroundColor: '#96ceb4',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          borderRadius: '50%',
          cursor: 'grab',
          userSelect: 'none',
        }
      }
    ];

    setElements(htmlElements);

    // 將所有物體加入世界
    const allBodies = [
      ground,
      leftWall,
      rightWall,
      ...htmlElements.map(el => el.body)
    ];
    World.add(engine.world, allBodies);

    // 添加滑鼠控制
    const mouse = Mouse.create(document.getElementById('container'));
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

  // const addRandomElement = () => {
  //   if (!engineRef.current) return;

  //   const newElement = {
  //     id: `random-${Date.now()}`,
  //     body: Bodies.rectangle(
  //       Math.random() * 700 + 50,
  //       50,
  //       60,
  //       60,
  //       {
  //         restitution: Math.random() * 0.8 + 0.2,
  //         friction: Math.random() * 0.5,
  //         label: 'randomBox'
  //       }
  //     ),
  //     type: 'div',
  //     content: ['🎯', '🎪', '🎨', '🎭', '🎪'][Math.floor(Math.random() * 5)],
  //     style: {
  //       width: '60px',
  //       height: '60px',
  //       backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
  //       color: 'white',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       fontSize: '1.5rem',
  //       borderRadius: '8px',
  //       cursor: 'grab',
  //       userSelect: 'none',
  //     }
  //   };

  //   setElements(prev => [...prev, newElement]);
  //   Matter.World.add(engineRef.current.world, newElement.body);
  // };

  // const resetElements = () => {
  //   if (!engineRef.current || !runnerRef.current) return;

  //   // 清除所有非靜態物體
  //   const allBodies = Matter.Composite.allBodies(engineRef.current.world);
  //   const dynamicBodies = allBodies.filter(body => !body.isStatic);
  //   Matter.World.remove(engineRef.current.world, dynamicBodies);

  //   // 重設元素狀態
  //   setElements([]);

  //   // 重新添加初始元素
  //   setTimeout(() => {
  //     // 這裡會觸發 useEffect 重新初始化
  //     window.location.reload();
  //   }, 100);
  // };

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex gap-2">
        {/* <button
          onClick={addRandomElement}
        // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          添加隨機元素
        </button> */}
        {/* <button
          onClick={resetElements}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          重設
        </button> */}
      </div>

      <div
        ref={containerRef}
        className="relative border-2 border-gray-300 bg-gray-50"
        style={{ width: '800px', height: '600px', overflow: 'hidden', border: '2px solid white' }}
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
              onClick={(e) => {
                if (element.type === 'button') {
                  e.preventDefault();
                  alert('按鈕被點擊了！即使在物理世界中也能正常工作！');
                }
              }}
            >
              {element.content}
            </Tag>
          );
        })}

        {/* 顯示邊界指示 */}

        <div className="absolute top-2 left-2 text-sm text-gray-600 bg-white p-2 rounded">
          提示：拖曳元素移動它們！按鈕仍然可以點擊！
        </div>
      </div>
    </div>
  );
};

export default HtmlPhysicsDemo;