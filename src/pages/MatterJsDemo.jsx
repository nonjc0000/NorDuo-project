import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const MatterJsDemo = () => {

  const wrapperRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    // module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    // create an engine
    const engine = Engine.create();

    // create a renderer
    const render = Render.create({
      element: wrapperRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 300,
        height: 300,
        background: '#F5F5F5',
        wireframes: false,
      },
    });

    // create three balls and a ground
        const floor = Bodies.rectangle(150, 300, 300, 20, {
            isStatic: true,
            render: {
                fillStyle: 'blue',
            },
        });

        const greenBall = Bodies.circle(150, 0, 10, {
            restitution: 0.9,
            friction: 0.1,
            render: {
                fillStyle: 'green',
            },
        });

        const redBall = Bodies.circle(150, 0, 10, {
            restitution: 0.5,
            friction: 0.5,
            render: {
                fillStyle: 'red',
            },
        });

        const yellowBall = Bodies.circle(100, 0, 10, {
            restitution: 0.1,
            render: {
                fillStyle: 'orange',
            },
        });

        World.add(engine.world, [greenBall, redBall, yellowBall, floor]);
        Engine.run(engine);
        Render.run(render);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: 300,
        height: 300,
      }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default MatterJsDemo
