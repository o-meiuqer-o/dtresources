export const levels = [
  {
    id: 1,
    title: "Level 1: Simple Gear Train",
    description: "Connect the input to the output. Notice how the gears turn in opposite directions.",
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#3498db' }
    ],
    pegs: [
      { id: 'p1', x: 620, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 720, y: 350, requiredTeeth: 18, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: -1.5 * (12/18)
    },
    lesson: "A simple gear train reverses the direction of rotation. The smaller driving gear (pinion) turns the larger driven gear, which results in a lower speed but higher torque."
  },
  {
    id: 2,
    title: "Level 2: The Idler Gear",
    description: "The output dial needs to turn in the SAME direction as the input motor. Use an idler gear in the middle!",
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 12, radius: 40, color: '#f1c40f' },
      { id: 'g3', teeth: 18, radius: 60, color: '#3498db' }
    ],
    pegs: [
      { id: 'p1', x: 620, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 700, y: 350, requiredTeeth: 12, type: 'idler' },
      { id: 'p3', x: 800, y: 350, requiredTeeth: 18, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: 1.5 * (12/18) 
    },
    lesson: "An idler gear is placed between a driving and driven gear. It doesn't change the gear ratio between the input and output, but it DOES reverse the direction, so the input and output spin in the same direction."
  },
  {
    id: 3,
    title: "Level 3: Reaching the Output",
    description: "The output is far away. Build a gear train to bridge the gap.",
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#2ecc71' },
      { id: 'g3', teeth: 18, radius: 60, color: '#9b59b6' },
      { id: 'g4', teeth: 12, radius: 40, color: '#3498db' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 620, y: 350, requiredTeeth: 18, type: 'idler' },
      { id: 'p3', x: 740, y: 350, requiredTeeth: 18, type: 'idler' },
      { id: 'p4', x: 840, y: 350, requiredTeeth: 12, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: -1.5 * (12/12) 
    },
    lesson: "In a simple gear train with any number of gears, the overall gear ratio only depends on the first and last gear. The intermediate gears only serve to span distance and alternate the direction."
  },
  {
    id: 4,
    title: "Level 4: Speeding It Up",
    description: "Sometimes you need the output to spin faster than the motor. Use a large driving gear to turn a small driven gear.",
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'g2', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g3', teeth: 12, radius: 40, color: '#3498db' }
    ],
    pegs: [
      { id: 'p1', x: 570, y: 350, requiredTeeth: 24, type: 'input' },
      { id: 'p2', x: 690, y: 350, requiredTeeth: 12, type: 'output' }
    ],
    target: {
      inputSpeed: 1.0,
      outputSpeed: -1.0 * (24/12) 
    },
    lesson: "When a large gear drives a smaller gear, it's called 'gearing up'. The smaller gear spins much faster, but it has less rotational force (torque). It's a trade-off!"
  },
  {
    id: 5,
    title: "Level 5: The Giant Idler",
    description: "Connect the gears across a large gap. Does the size of the idler gear matter?",
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 24, radius: 80, color: '#2ecc71' },
      { id: 'g3', teeth: 12, radius: 40, color: '#f1c40f' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 640, y: 350, requiredTeeth: 24, type: 'idler' },
      { id: 'p3', x: 760, y: 350, requiredTeeth: 12, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: 1.5 * (12/12) 
    },
    lesson: "The size of an idler gear doesn't change the final speed ratio! Since it's both driven (by the input) and driving (the output), its size mathematically cancels out."
  },
  {
    id: 6,
    title: "Level 6: Decoys",
    description: "Only use the gears that fit. Some gears on the shelf won't work for this mechanism.",
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'g2', teeth: 12, radius: 40, color: '#3498db' },
      { id: 'g3', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'g4', teeth: 6, radius: 20, color: '#f1c40f' },
      { id: 'g5', teeth: 18, radius: 60, color: '#2ecc71' }
    ],
    pegs: [
      { id: 'p1', x: 620, y: 250, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 720, y: 250, requiredTeeth: 12, type: 'idler' },
      { id: 'p3', x: 820, y: 250, requiredTeeth: 18, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: 1.5 * (18/18) 
    },
    lesson: "In real life, if you use a gear that's too large, it will jam the machine. If you use one that's too small, the teeth won't mesh. Precision is key in mechanical design!"
  },
  {
    id: 7,
    title: "Level 7: The Zig-Zag",
    description: "Gears don't always run in a straight line. Follow the pegs to transfer power around the corner.",
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'g3', teeth: 12, radius: 40, color: '#2ecc71' },
      { id: 'g4', teeth: 12, radius: 40, color: '#f1c40f' }
    ],
    pegs: [
      { id: 'p1', x: 620, y: 200, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 740, y: 200, requiredTeeth: 18, type: 'idler' }, 
      { id: 'p3', x: 740, y: 300, requiredTeeth: 12, type: 'idler' }, 
      { id: 'p4', x: 660, y: 300, requiredTeeth: 12, type: 'output' } 
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: -1.5 * (18/12) 
    },
    lesson: "Power can be transferred in any direction as long as the gears mesh. This allows engineers to move power from an engine in the front of a car to the wheels in the back!"
  },
  {
    id: 8,
    title: "Level 8: Heavy Lifting",
    description: "The output dial is now connected to a heavy 2-ton winch! You need maximum turning force (torque) to lift it.",
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'g3', teeth: 18, radius: 60, color: '#3498db' }
    ],
    pegs: [
      { id: 'p1', x: 570, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 690, y: 350, requiredTeeth: 24, type: 'output' }
    ],
    target: {
      type: 'crane',
      inputSpeed: 1.5,
      outputSpeed: -1.5 * (12/24) 
    },
    lesson: "When a small gear drives a larger gear, it's called 'gearing down'. The larger gear spins slower, but the trade-off is a massive increase in Torque (rotational force), allowing you to lift heavy objects!"
  },
  {
    id: 9,
    title: "Level 9: The Pinion and the Bull",
    description: "Lift an even heavier load. Use the smallest possible driving gear to turn the largest possible driven gear.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 6, radius: 20, color: '#f1c40f' },
      { id: 'g2', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'g3', teeth: 12, radius: 40, color: '#e74c3c' }
    ],
    pegs: [
      { id: 'p1', x: 570, y: 350, requiredTeeth: 6, type: 'input' },
      { id: 'p2', x: 670, y: 350, requiredTeeth: 24, type: 'output' }
    ],
    target: {
      type: 'crane',
      inputSpeed: 2.0,
      outputSpeed: -2.0 * (6/24) 
    },
    lesson: "By using a 6-tooth pinion to drive a 24-tooth bull gear, you achieved a 4:1 gear ratio. The output spins 4 times slower, but produces 4 times the torque! Perfect for cranes, winches, and tank treads."
  },
  {
    id: 10,
    title: "Level 10: Torque Across the Gap",
    description: "The crane is far away. Build a gear train that successfully gears down the speed by the time it reaches the output.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#2ecc71' },
      { id: 'g3', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'g4', teeth: 24, radius: 80, color: '#9b59b6' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 620, y: 350, requiredTeeth: 18, type: 'idler' },
      { id: 'p3', x: 740, y: 350, requiredTeeth: 18, type: 'idler' },
      { id: 'p4', x: 880, y: 350, requiredTeeth: 24, type: 'output' }
    ],
    target: {
      type: 'crane',
      inputSpeed: 2.0,
      outputSpeed: -2.0 * (12/24) 
    },
    lesson: "Remember: in a simple gear train, the idler gears only transfer power. The final torque and speed ratio is entirely determined by the very first gear (12) and the very last gear (24)!"
  },
  {
    id: 11,
    title: "Level 11: The Crank and Piston",
    description: "Convert rotational motion into linear motion! Connect the crank pin on the gear to the slider using a rigid connecting rod (linkage).",
    hideCues: false,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 150, color: '#bdc3c7' },
      { id: 'l2', type: 'linkage', length: 200, color: '#95a5a6' }
    ],
    pegs: [
      { id: 'p1', x: 570, y: 400, requiredTeeth: 24, type: 'input', pinOffset: 50 }
    ],
    sliders: [
      { id: 's1', pegId: 'p1', startX: 770, y: 400, requiredLength: 150 }
    ],
    target: {
      type: 'train',
      inputSpeed: 2.0,
      outputSpeed: 2.0
    },
    lesson: "A Crank-Slider mechanism perfectly converts rotational motion to linear motion (or vice versa). This is exactly how a car engine's pistons turn the crankshaft, or how a steam locomotive's pistons drive the wheels!"
  },
  {
    id: 12,
    title: "Level 12: The Steam Engine",
    description: "Build a locomotive drive system. Use a large bull gear and a long linkage to drive the distant piston.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#3498db' },
      { id: 'g2', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 150, color: '#bdc3c7' },
      { id: 'l2', type: 'linkage', length: 250, color: '#95a5a6' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 640, y: 400, requiredTeeth: 24, type: 'idler', pinOffset: 60 }
    ],
    sliders: [
      { id: 's1', pegId: 'p2', startX: 940, y: 400, requiredLength: 250 }
    ],
    target: {
      type: 'train',
      inputSpeed: 2.0,
      outputSpeed: -2.0 * (12/24)
    },
  },
  {
    id: 13,
    title: "Level 13: The Perfect Reach",
    description: "Linkages come in different lengths. Pick the one that perfectly reaches the slider without jamming.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 100, color: '#bdc3c7' },
      { id: 'l2', type: 'linkage', length: 150, color: '#95a5a6' },
      { id: 'l3', type: 'linkage', length: 200, color: '#7f8c8d' }
    ],
    pegs: [
      { id: 'p1', x: 570, y: 400, requiredTeeth: 18, type: 'input', pinOffset: 40 }
    ],
    sliders: [
      { id: 's1', pegId: 'p1', startX: 770, y: 400, requiredLength: 200 }
    ],
    target: { type: 'train', inputSpeed: 2.0, outputSpeed: 2.0 },
    lesson: "If a linkage is too short, it will mathematically 'jam' before the crank completes a full rotation. It must be longer than the furthest distance the pin travels from the slider!"
  },
  {
    id: 14,
    title: "Level 14: Vertical Offset",
    description: "The slider doesn't have to be perfectly level with the gear. Connect them diagonally!",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 250, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 480, requiredTeeth: 24, type: 'input', pinOffset: 50 }
    ],
    sliders: [
      { id: 's1', pegId: 'p1', startX: 720, y: 350, requiredLength: 250 }
    ],
    target: { type: 'train', inputSpeed: 2.0, outputSpeed: 2.0 },
    lesson: "Connecting rods can operate at severe angles. The math (inverse kinematics) automatically adjusts the horizontal stroke based on the vertical offset."
  },
  {
    id: 15,
    title: "Level 15: Fast Pumping Action",
    description: "Combine gears and linkages! Use a gear train to speed up the rotation before driving the piston.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'g2', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 150, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 400, requiredTeeth: 24, type: 'input' },
      { id: 'p2', x: 640, y: 400, requiredTeeth: 12, type: 'output', pinOffset: 25 }
    ],
    sliders: [
      { id: 's1', pegId: 'p2', startX: 790, y: 400, requiredLength: 150 }
    ],
    target: { type: 'train', inputSpeed: 1.5, outputSpeed: -1.5 * (24/12) },
    lesson: "By gearing up the speed before attaching the crank-slider, you create a fast-pumping machine, like the pistons in a high-RPM race car engine."
  },
  {
    id: 16,
    title: "Level 16: The Slow Crusher",
    description: "We need maximum crushing force. Gear down the speed to create massive torque on the linkage.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#f1c40f' },
      { id: 'g3', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'l1', type: 'linkage', length: 200, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 570, y: 400, requiredTeeth: 18, type: 'idler' },
      { id: 'p3', x: 710, y: 400, requiredTeeth: 24, type: 'output', pinOffset: 50 }
    ],
    sliders: [
      { id: 's1', pegId: 'p3', startX: 910, y: 400, requiredLength: 200 }
    ],
    target: { type: 'train', inputSpeed: 3.0, outputSpeed: 3.0 * (12/24) },
    lesson: "Gearing down (small to large gear) multiplies the torque. This high rotational force is then transferred to the linkage, creating immense pushing power at the slider."
  },
  {
    id: 17,
    title: "Level 17: Twin Cylinders",
    description: "Run two separate piston systems off the same gear train. Connect gears vertically!",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#3498db' },
      { id: 'g2', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 200, color: '#bdc3c7' },
      { id: 'l2', type: 'linkage', length: 150, color: '#95a5a6' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 300, requiredTeeth: 24, type: 'input', pinOffset: 40 },
      { id: 'p2', x: 520, y: 440, requiredTeeth: 18, type: 'output', pinOffset: 30 }
    ],
    sliders: [
      { id: 's1', pegId: 'p1', startX: 720, y: 300, requiredLength: 200 },
      { id: 's2', pegId: 'p2', startX: 670, y: 440, requiredLength: 150 }
    ],
    target: { type: 'train', inputSpeed: 1.5, outputSpeed: -1.5 * (24/18) },
    lesson: "In complex machines like V8 engines, a single gear train drives multiple distinct piston mechanisms at different speeds and offsets."
  },
  {
    id: 18,
    title: "Level 18: The Distant Pump",
    description: "Transfer the power across the board using idlers, and use a small crank pin to drive a distant pump.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#2ecc71' },
      { id: 'g3', teeth: 12, radius: 40, color: '#9b59b6' },
      { id: 'l1', type: 'linkage', length: 150, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 590, y: 400, requiredTeeth: 18, type: 'idler' },
      { id: 'p3', x: 690, y: 400, requiredTeeth: 12, type: 'output', pinOffset: 20 }
    ],
    sliders: [
      { id: 's1', pegId: 'p3', startX: 840, y: 400, requiredLength: 150 }
    ],
    target: { type: 'train', inputSpeed: 1.5, outputSpeed: 1.5 * (18/12) },
    lesson: "Idlers bridge the gap! Since the final gear is smaller than the first, the overall system still gears UP the speed, resulting in a fast pump."
  },
  {
    id: 19,
    title: "Level 19: The Ultimate Engine",
    description: "This engine features two crank pins on different gears, driving pistons at extreme vertical offsets.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#f1c40f' },
      { id: 'g2', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'l1', type: 'linkage', length: 250, color: '#bdc3c7' },
      { id: 'l2', type: 'linkage', length: 200, color: '#95a5a6' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 400, requiredTeeth: 24, type: 'input', pinOffset: 60 },
      { id: 'p2', x: 640, y: 400, requiredTeeth: 12, type: 'output', pinOffset: 20 }
    ],
    sliders: [
      { id: 's1', pegId: 'p1', startX: 720, y: 250, requiredLength: 250 },
      { id: 's2', pegId: 'p2', startX: 790, y: 550, requiredLength: 200 }
    ],
    target: { type: 'train', inputSpeed: 1.5, outputSpeed: -1.5 * (24/12) },
  },
  {
    id: 20,
    title: "Level 20: The Conveyor Belt",
    description: "Belts transfer power over long distances without reversing the direction. Connect the two pulleys!",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'b1', type: 'belt', beltType: 'belt', color: '#34495e' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 770, y: 400, requiredTeeth: 18, type: 'output', drivenBy: 'p1', driveType: 'belt' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'belt' }
    ],
    target: { type: 'conveyor', inputSpeed: 2.0, outputSpeed: 2.0 },
    lesson: "Belts are incredibly efficient at spanning large gaps. Because the belt wraps around the outside, both pulleys spin in the SAME direction!"
  },
  {
    id: 21,
    title: "Level 21: Belt Drives",
    description: "Belts can gear up or down just like gears. Use a large pulley to drive a small one.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'g2', teeth: 12, radius: 40, color: '#f1c40f' },
      { id: 'b1', type: 'belt', beltType: 'belt', color: '#34495e' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 24, type: 'input' },
      { id: 'p2', x: 770, y: 400, requiredTeeth: 12, type: 'output', drivenBy: 'p1', driveType: 'belt' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'belt' }
    ],
    target: { type: 'bicycle', inputSpeed: 1.5, outputSpeed: 1.5 * (24/12) },
    lesson: "The speed ratio math for chains and belts is exactly the same as gears! A 24-tooth pedal sprocket driving a 12-tooth rear sprocket doubles the wheel speed of a bicycle."
  },
  {
    id: 22,
    title: "Level 22: Figure-Eight",
    description: "Sometimes you need to reverse direction over a long distance. Use a crossed belt!",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#2ecc71' },
      { id: 'g2', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'b1', type: 'crossed_belt', beltType: 'crossed_belt', color: '#2c3e50' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 770, y: 400, requiredTeeth: 18, type: 'output', drivenBy: 'p1', driveType: 'crossed_belt' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'crossed_belt' }
    ],
    target: { type: 'mill', inputSpeed: 2.0, outputSpeed: -2.0 },
    lesson: "Crossing a belt forms a figure-eight. This clever trick reverses the rotational direction without needing an idler gear, perfect for driving a double-roller crushing mill!"
  },
  {
    id: 23,
    title: "Level 23: The Factory Line",
    description: "Use multiple belts and an intermediary double-pulley to bridge a massive gap.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'g2', teeth: 18, radius: 60, color: '#f1c40f' },
      { id: 'g3', teeth: 18, radius: 60, color: '#9b59b6' },
      { id: 'b1', type: 'belt', beltType: 'belt', color: '#34495e' },
      { id: 'b2', type: 'belt', beltType: 'belt', color: '#34495e' }
    ],
    pegs: [
      { id: 'p1', x: 420, y: 400, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 670, y: 400, requiredTeeth: 18, type: 'idler', drivenBy: 'p1', driveType: 'belt' },
      { id: 'p3', x: 920, y: 400, requiredTeeth: 18, type: 'output', drivenBy: 'p2', driveType: 'belt' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'belt' },
      { id: 'b2', p1: 'p2', p2: 'p3', type: 'belt' }
    ],
    target: { type: 'conveyor', inputSpeed: 2.0, outputSpeed: 2.0 },
    lesson: "In industrial machines, multiple belts are often used in sequence to safely transmit power across an entire factory floor."
  },
  {
    id: 24,
    title: "Level 24: High Tension",
    description: "Combine standard and crossed belts to achieve the correct speed and direction.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 24, radius: 80, color: '#2ecc71' },
      { id: 'g3', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'b1', type: 'crossed_belt', beltType: 'crossed_belt', color: '#2c3e50' },
      { id: 'b2', type: 'belt', beltType: 'belt', color: '#34495e' }
    ],
    pegs: [
      { id: 'p1', x: 420, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 670, y: 400, requiredTeeth: 24, type: 'idler', drivenBy: 'p1', driveType: 'crossed_belt' },
      { id: 'p3', x: 920, y: 400, requiredTeeth: 18, type: 'output', drivenBy: 'p2', driveType: 'belt' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'crossed_belt' },
      { id: 'b2', p1: 'p2', p2: 'p3', type: 'belt' }
    ],
    target: { type: 'mill', inputSpeed: 2.0, outputSpeed: -2.0 * (12/24) * (24/18) },
    lesson: "You can mix and match belt types! The crossed belt reversed the direction and geared down the speed, while the standard belt carried it to the final output."
  },
  {
    id: 25,
    title: "Level 25: The Workshop",
    description: "Gears drive a belt, which drives a crank-slider. Build the complete assembly!",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#3498db' },
      { id: 'g2', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'g3', teeth: 12, radius: 40, color: '#9b59b6' },
      { id: 'b1', type: 'belt', beltType: 'belt', color: '#34495e' },
      { id: 'l1', type: 'linkage', length: 150, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 420, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 540, y: 400, requiredTeeth: 24, type: 'idler', drivenBy: 'p1', driveType: 'gear' },
      { id: 'p3', x: 770, y: 400, requiredTeeth: 12, type: 'output', drivenBy: 'p2', driveType: 'belt', pinOffset: 25 }
    ],
    belts: [
      { id: 'b1', p1: 'p2', p2: 'p3', type: 'belt' }
    ],
    sliders: [
      { id: 's1', pegId: 'p3', startX: 920, y: 400, requiredLength: 150 }
    ],
    target: { type: 'train', inputSpeed: 2.0, outputSpeed: -2.0 * (12/24) * (24/12) },
    lesson: "This is a true industrial machine. A motor (gear) drives a heavy transmission (belt), which powers a distant linear actuator (linkage)!"
  },
  {
    id: 26,
    title: "Level 26: Timing Belt",
    description: "Use a crossed belt to drive a gear train that operates a double-piston engine.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#2ecc71' },
      { id: 'g2', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'g3', teeth: 12, radius: 40, color: '#f1c40f' },
      { id: 'b1', type: 'crossed_belt', beltType: 'crossed_belt', color: '#2c3e50' },
      { id: 'l1', type: 'linkage', length: 200, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 420, y: 350, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 670, y: 350, requiredTeeth: 24, type: 'idler', drivenBy: 'p1', driveType: 'crossed_belt', pinOffset: 50 },
      { id: 'p3', x: 670, y: 470, requiredTeeth: 12, type: 'output', drivenBy: 'p2', driveType: 'gear' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'crossed_belt' }
    ],
    sliders: [
      { id: 's1', pegId: 'p2', startX: 870, y: 350, requiredLength: 200 }
    ],
    target: { type: 'train', inputSpeed: 2.0, outputSpeed: -2.0 * (-18/24) * -(24/12) },
    lesson: "Automotive timing belts keep the crankshaft (pistons) perfectly synchronized with the camshaft (valves) at precise gear ratios."
  },
  {
    id: 27,
    title: "Level 27: The Grand Conveyor",
    description: "Use an intricate web of gears, a standard belt, and a crossed belt to run a complex logistics network.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 12, radius: 40, color: '#3498db' },
      { id: 'g3', teeth: 18, radius: 60, color: '#9b59b6' },
      { id: 'g4', teeth: 18, radius: 60, color: '#f1c40f' },
      { id: 'b1', type: 'belt', beltType: 'belt', color: '#34495e' },
      { id: 'b2', type: 'crossed_belt', beltType: 'crossed_belt', color: '#2c3e50' }
    ],
    pegs: [
      { id: 'p1', x: 420, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 500, y: 400, requiredTeeth: 12, type: 'idler', drivenBy: 'p1', driveType: 'gear' },
      { id: 'p3', x: 720, y: 400, requiredTeeth: 18, type: 'idler', drivenBy: 'p2', driveType: 'belt' },
      { id: 'p4', x: 920, y: 400, requiredTeeth: 18, type: 'output', drivenBy: 'p3', driveType: 'crossed_belt' }
    ],
    belts: [
      { id: 'b1', p1: 'p2', p2: 'p3', type: 'belt' },
      { id: 'b2', p1: 'p3', p2: 'p4', type: 'crossed_belt' }
    ],
    target: { type: 'conveyor', inputSpeed: 3.0, outputSpeed: 3.0 * (12/18) },
    lesson: "In a massive logistics center, motors drive localized gear trains, which then power massive rubber belts running across the entire warehouse."
  },
  {
    id: 28,
    title: "Level 28: Master Engineer",
    description: "The ultimate challenge. Every mechanic in one machine. Godspeed.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#2ecc71' },
      { id: 'g3', teeth: 12, radius: 40, color: '#3498db' },
      { id: 'g4', teeth: 24, radius: 80, color: '#9b59b6' },
      { id: 'b1', type: 'crossed_belt', beltType: 'crossed_belt', color: '#2c3e50' },
      { id: 'l1', type: 'linkage', length: 250, color: '#bdc3c7' }
    ],
    pegs: [
      { id: 'p1', x: 370, y: 350, requiredTeeth: 24, type: 'input' },
      { id: 'p2', x: 620, y: 350, requiredTeeth: 18, type: 'idler', drivenBy: 'p1', driveType: 'crossed_belt', pinOffset: 40 },
      { id: 'p3', x: 620, y: 450, requiredTeeth: 12, type: 'idler', drivenBy: 'p2', driveType: 'gear' },
      { id: 'p4', x: 740, y: 450, requiredTeeth: 24, type: 'output', drivenBy: 'p3', driveType: 'gear' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'crossed_belt' }
    ],
    sliders: [
      { id: 's1', pegId: 'p2', startX: 870, y: 250, requiredLength: 250 }
    ],
    target: { type: 'train', inputSpeed: 2.0, outputSpeed: -2.0 },
    lesson: "Congratulations! You've combined belts, gear trains, and linkages into one masterpiece."
  },
  {
    id: 29,
    title: "Level 29: The Camshaft",
    description: "Cams convert rotational motion into linear motion, but unlike linkages, they push a follower only when the 'lobe' strikes it.",
    hideCues: true,
    shelfGears: [
      { id: 'c1', type: 'cam', color: '#9b59b6' }
    ],
    pegs: [
      { id: 'p1', x: 620, y: 400, requiredType: 'cam', type: 'input' }
    ],
    followers: [
      { id: 'f1', pegId: 'p1' }
    ],
    target: { type: 'cam_engine', inputSpeed: 2.0, outputSpeed: 2.0 },
    lesson: "Cams are essential in car engines! They open and close the intake and exhaust valves at precisely the right moments."
  },
  {
    id: 30,
    title: "Level 30: Valve Timing",
    description: "Use a gear to drive the cam at half the speed of the motor.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#e74c3c' },
      { id: 'g2', teeth: 24, radius: 80, color: '#3498db' },
      { id: 'c1', type: 'cam', color: '#9b59b6' }
    ],
    pegs: [
      { id: 'p1', x: 520, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 640, y: 400, requiredTeeth: 24, type: 'idler', drivenBy: 'p1', driveType: 'gear' },
      { id: 'p3', x: 640, y: 400, requiredType: 'cam', type: 'output', drivenBy: 'p2', driveType: 'shaft' }
    ],
    followers: [
      { id: 'f1', pegId: 'p3' }
    ],
    target: { type: 'cam_engine', inputSpeed: 2.0, outputSpeed: -2.0 * (12/24) },
    lesson: "In a 4-stroke engine, the camshaft spins at exactly HALF the speed of the crankshaft. Gears allow us to achieve this precise timing! Notice how you placed the cam on the SAME shaft as the gear."
  },
  {
    id: 31,
    title: "Level 31: Remote Valve",
    description: "Use a belt to drive a distant camshaft.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 18, radius: 60, color: '#e74c3c' },
      { id: 'g2', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'b1', type: 'belt', beltType: 'belt', color: '#34495e' },
      { id: 'c1', type: 'cam', color: '#9b59b6' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 18, type: 'input' },
      { id: 'p2', x: 770, y: 400, requiredTeeth: 18, type: 'idler', drivenBy: 'p1', driveType: 'belt' },
      { id: 'p3', x: 770, y: 400, requiredType: 'cam', type: 'output', drivenBy: 'p2', driveType: 'shaft' }
    ],
    belts: [
      { id: 'b1', p1: 'p1', p2: 'p2', type: 'belt' }
    ],
    followers: [
      { id: 'f1', pegId: 'p3' }
    ],
    target: { type: 'cam_engine', inputSpeed: 2.0, outputSpeed: 2.0 },
    lesson: "Overhead cam engines use a timing belt to connect the crankshaft at the bottom of the engine to the camshaft at the top!"
  },
  {
    id: 32,
    title: "Level 32: The Automaton",
    description: "Combine everything! A gear train driving a belt, powering a cam, operating a follower.",
    hideCues: true,
    shelfGears: [
      { id: 'g1', teeth: 12, radius: 40, color: '#f1c40f' },
      { id: 'g2', teeth: 24, radius: 80, color: '#e74c3c' },
      { id: 'g3', teeth: 18, radius: 60, color: '#3498db' },
      { id: 'b1', type: 'crossed_belt', beltType: 'crossed_belt', color: '#2c3e50' },
      { id: 'c1', type: 'cam', color: '#9b59b6' }
    ],
    pegs: [
      { id: 'p1', x: 470, y: 400, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 590, y: 400, requiredTeeth: 24, type: 'idler', drivenBy: 'p1', driveType: 'gear' },
      { id: 'p3', x: 870, y: 400, requiredTeeth: 18, type: 'idler', drivenBy: 'p2', driveType: 'crossed_belt' },
      { id: 'p4', x: 870, y: 400, requiredType: 'cam', type: 'output', drivenBy: 'p3', driveType: 'shaft' }
    ],
    belts: [
      { id: 'b1', p1: 'p2', p2: 'p3', type: 'crossed_belt' }
    ],
    followers: [
      { id: 'f1', pegId: 'p4' }
    ],
    target: { type: 'cam_engine', inputSpeed: 2.0, outputSpeed: 2.0 * (12/18) },
    lesson: "You've successfully built a fully functioning mechanical automaton sequence! You are a master engineer."
  }
];
