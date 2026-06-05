import io

with io.open('mechanisms.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

gear_code = """
class GearTrain extends Mechanism {
    constructor(canvasId, gearsConfig) {
        super(canvasId);
        this.gears = gearsConfig;
        this.slider = document.getElementById('mech-gears-slider');
        if (this.slider) {
            this.slider.addEventListener('input', (e) => {
                this.isPlaying = false;
                this.theta = parseFloat(e.target.value);
                this.draw();
            });
        }
    }

    drawGear(cx, cy, r, teeth, angle) {
        // draw teeth
        for(let i = 0; i < teeth; i++) {
            const a = i * (Math.PI * 2 / teeth);
            this.ctx.save();
            this.ctx.translate(cx, cy);
            this.ctx.rotate(angle + a);
            this.ctx.beginPath();
            // Blocky teeth
            this.ctx.rect(r - 5, -r*Math.PI/teeth*0.6, 12, r*Math.PI/teeth*1.2);
            this.ctx.fillStyle = THEME.shapes;
            this.ctx.fill();
            this.ctx.lineWidth = THEME.strokeWidth;
            this.ctx.strokeStyle = THEME.dark;
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        // base circle
        this.drawCircle(cx, cy, r - 3, THEME.bg, null);
        this.drawCircle(cx, cy, r - 3, null, THEME.dark);
        this.drawCircle(cx, cy, r - 8, THEME.shapes, THEME.dark);
        
        // axis / shaft
        this.drawCircle(cx, cy, 6, THEME.dark, null);
        
        // reference marker to show rotation visually
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(angle);
        this.drawCircle(r/2, 0, 5, THEME.accent, THEME.dark);
        this.ctx.restore();
    }

    draw() {
        super.draw();
        
        let currentAngle = this.theta;
        for(let i=0; i<this.gears.length; i++) {
            let g = this.gears[i];
            
            if (i > 0) {
                let prev = this.gears[i-1];
                // basic ratio inversion
                currentAngle = -(prev.r / g.r) * currentAngle;
            }
            
            this.drawGear(g.cx, g.cy, g.r, g.teeth, currentAngle + g.offset);
        }
    }
}
"""

if "class GearTrain extends Mechanism" not in js_content:
    insert_pos = js_content.find('// Initialization')
    js_content = js_content[:insert_pos] + gear_code + js_content[insert_pos:]
    
    init_str = "    anims.push(new JansenGait('mech-jansen-gait'));"
    
    # 4 gear scenarios
    # 1:1 -> Two identical 40px radius 16 teeth
    # offset: left gear tooth is at 0 (angle 0). Right gear tooth must NOT be at PI. 
    # For right gear (n=16), tooth at PI is (16/2)=8th tooth. So it perfectly hits.
    # To mesh, we offset right gear by half a tooth = Math.PI/16
    g_1to1 = "    anims.push(new GearTrain('mech-gear-1to1', [{cx:150, cy:100, r:40, teeth:16, offset:0}, {cx:230, cy:100, r:40, teeth:16, offset:Math.PI/16}]));"
    
    # Speed Up -> Driving 60px 24t, Driven 30px 12t.
    # Left tooth at 0. Right tooth at PI is 6th tooth. We offset right gear by half a tooth = Math.PI/12
    g_speed = "    anims.push(new GearTrain('mech-gear-speed', [{cx:140, cy:100, r:60, teeth:24, offset:0}, {cx:230, cy:100, r:30, teeth:12, offset:Math.PI/12}]));"
    
    # Torque Up -> Driving 30px 12t, Driven 60px 24t
    # Left tooth at 0. Right tooth at PI is 12th tooth. We offset right by half a tooth = Math.PI/24
    g_torque = "    anims.push(new GearTrain('mech-gear-torque', [{cx:140, cy:100, r:30, teeth:12, offset:0}, {cx:230, cy:100, r:60, teeth:24, offset:Math.PI/24}]));"
    
    # Idler -> 30px 12t (100,100), 30px 12t (160,100), 30px 12t (220,100)
    # Middle gear offset PI/12. Right gear offset back to 0.
    g_idler = "    anims.push(new GearTrain('mech-gear-idler', [{cx:120, cy:100, r:30, teeth:12, offset:0}, {cx:180, cy:100, r:30, teeth:12, offset:Math.PI/12}, {cx:240, cy:100, r:30, teeth:12, offset:0}]));"
    
    new_init_str = init_str + "\\n" + g_1to1 + "\\n" + g_speed + "\\n" + g_torque + "\\n" + g_idler
    js_content = js_content.replace(init_str, new_init_str)

with io.open('mechanisms.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
