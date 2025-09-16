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
    const rightWall = Bodies.rectangle(800, 300, 20, 600, {
      isStatic: true,
      label: 'wall'
    });

    // 創建一些 HTML 物理元素
    const htmlElements = [
      {
        id: 'Improvisation',
        body: Bodies.rectangle(200, 31, 315, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'BE CREATIVE',
        body: Bodies.rectangle(500, 31, 285, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Guitar',
        body: Bodies.rectangle(200, 31, 178, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Keyboard',
        body: Bodies.rectangle(400, 31, 217, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Composition',
        body: Bodies.rectangle(600, 31, 276, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Harmony',
        body: Bodies.rectangle(500, 31, 198, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Bass',
        body: Bodies.rectangle(500, 31, 139, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Drum',
        body: Bodies.rectangle(700, 31, 139, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },
      {
        id: 'Vocal',
        body: Bodies.rectangle(600, 31, 158, 62, {
          restitution: 0.8,
          friction: 0.3,
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
        }
      },


      // {
      //   id: 'text1',
      //   body: Bodies.rectangle(300, 50, 120, 40, {
      //     restitution: 0.6,
      //     friction: 0.5,
      //     label: 'htmlText'
      //   }),
      //   type: 'p',
      //   content: 'Hello Physics!',
      //   style: {
      //     width: '120px',
      //     height: '40px',
      //     backgroundColor: '#4ecdc4',
      //     color: 'white',
      //     display: 'flex',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //     margin: '0',
      //     padding: '0',
      //     borderRadius: '20px',
      //     fontWeight: 'bold',
      //     cursor: 'grab',
      //     userSelect: 'none',
      //   }
      // },
      // {
      //   id: 'button1',
      //   body: Bodies.rectangle(500, 80, 100, 50, {
      //     restitution: 0.9,
      //     friction: 0.2,
      //     label: 'htmlButton'
      //   }),
      //   type: 'button',
      //   content: 'Click Me!',
      //   style: {
      //     width: '100px',
      //     height: '50px',
      //     backgroundColor: '#45b7d1',
      //     color: 'white',
      //     border: 'none',
      //     borderRadius: '25px',
      //     fontSize: '14px',
      //     fontWeight: 'bold',
      //     cursor: 'pointer',
      //   }
      // },
      // {
      //   id: 'circle1',
      //   body: Bodies.circle(150, 30, 30, {
      //     restitution: 1.0,
      //     friction: 0.1,
      //     label: 'htmlCircle'
      //   }),
      //   type: 'div',
      //   content: '⚽',
      //   style: {
      //     width: '60px',
      //     height: '60px',
      //     backgroundColor: '#96ceb4',
      //     color: 'white',
      //     display: 'flex',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //     fontSize: '1.5rem',
      //     borderRadius: '50%',
      //     cursor: 'grab',
      //     userSelect: 'none',
      //   }
      // }
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

  return (
    <div className="w-full h-full">
      <div className="mb-4 flex gap-2">
      </div>

      <div
        ref={containerRef}
        // className="relative border-2 border-gray-300 bg-gray-50"
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