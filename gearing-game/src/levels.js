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
      { id: 'p1', x: 400, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 500, y: 350, requiredTeeth: 18, type: 'output' }
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
      { id: 'p1', x: 400, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 480, y: 350, requiredTeeth: 12, type: 'idler' },
      { id: 'p3', x: 580, y: 350, requiredTeeth: 18, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: 1.5 * (12/18) // Positive because of the idler gear reversing it twice
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
      { id: 'p1', x: 300, y: 350, requiredTeeth: 12, type: 'input' },
      { id: 'p2', x: 400, y: 350, requiredTeeth: 18, type: 'idler' },
      { id: 'p3', x: 520, y: 350, requiredTeeth: 18, type: 'idler' },
      { id: 'p4', x: 620, y: 350, requiredTeeth: 12, type: 'output' }
    ],
    target: {
      inputSpeed: 1.5,
      outputSpeed: -1.5 * (12/12) // Net ratio is 1:1, but 4 gears means reversed direction
    },
    lesson: "In a simple gear train with any number of gears, the overall gear ratio only depends on the first and last gear. The intermediate gears only serve to span distance and alternate the direction."
  }
];
