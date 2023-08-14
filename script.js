// init canvas
let canvas = document.createElement("canvas"),
  ctx = canvas.getContext("2d"),
  H = (canvas.height = 600),
  W = (canvas.width = 600);
document.body.appendChild(canvas);
ctx.lineCap = "round";

document.body.addEventListener("mousemove", event => mousemove(event), false);
let cursor = new Vector(0, 0);
function mousemove(event) {
  cursor.x = event.pageX - canvas.offsetLeft;
  cursor.y = event.pageY - canvas.offsetTop;
}

let gravity = new Vector(0, 0.6);

class Point {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.old_position = new Vector(x, y);
    this.pinned = false;
  }
}

class Link {
  constructor(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    this.length = p0.position.dist(p1.position);
  }
}

class Blade {
  constructor(x, y, size) {
    this.position = new Vector(x, y);
    this.size = size;
    this.color = "black";
    this.angle = -PI / 2 + Util.random(-PI / 4, PI / 4);
    this.length = Util.map(size, 1, 10, 10, 160);
    this.divisions = Math.ceil(Util.map(this.length, 10, 200, 3, 4));
    this.stiffness = Util.random(2, 6);
    this.thickness = Util.map(size, 1, 10, 1, 16);
    this.points = [];
    this.links = [];

    // add points
    for (let i = 0; i < this.divisions; i++) {
      let separation = this.length / this.divisions * i;
      let v = new Vector(0, 0);
      v.setMag(separation);
      v.setHeading(this.angle);
      v.add(this.position);
      this.points.push(new Point(v.x, v.y));
    }
    this.points[0].pinned = true;
    for (let i = 0; i < this.divisions - 1; i++) {
      this.links.push(new Link(this.points[i], this.points[i + 1]));
    }
  }

  update() {
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];

      if (point.pinned) continue;
      let velocity = point.position.copy();
      velocity.sub(point.old_position);
      velocity.mult(0.98);
      point.old_position = point.position.copy();
      point.position.add(velocity);

      point.position.x += Math.cos(this.angle) * (this.stiffness / i);
      point.position.y += Math.sin(this.angle) * (this.stiffness / i);

      let distance = point.position.dist(cursor);

      if (distance < force_contact.size) {
        let force = new Vector();

        let angle = point.position.angle(cursor);
        force.setMag(Util.map(distance, 0, force_contact.size, 1, 0));
        force.setHeading(angle);
        point.position.sub(force);
      }

      point.position.add(wind.value);
      point.position.add(gravity);
    }
    for (let i = 0; i < 5; i++) {
      this.links.forEach(link => {
        let distance = link.p0.position.dist(link.p1.position),
          difference = link.length - distance,
          percent = difference / distance / 2;
        let offset = new Vector(
          (link.p1.position.x - link.p0.position.x) * percent,
          (link.p1.position.y - link.p0.position.y) * percent
        );
        if (!link.p0.pinned) {
          link.p0.position.sub(offset);
        }
        if (!link.p1.pinned) {
          link.p1.position.add(offset);
        }
      });
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    stroke(this.points.map(point => point.position), this.thickness);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

class Dandelion {
  constructor(x, y, size) {
    this.position = new Vector(x, y);
    this.size = size;
    this.color = "#202236";
    this.max_length = 220;
    this.angle = -PI / 2 + Util.random(-0.3, 0.3);
    this.length = Util.map(size, 1, 10, 60, this.max_length);
    this.divisions = Math.ceil(
      Util.map(this.length, 60, this.max_length, 3, 4)
    );
    this.stiffness = Util.random(4, 8);
    this.thickness = Util.map(this.length, 60, this.max_length, 3, 6);
    this.head_size = Util.map(this.thickness, 3, 6, 6, 18);
    this.points = [];
    this.links = [];

    // add points
    for (let i = 0; i < this.divisions; i++) {
      let separation = this.length / this.divisions * i;
      let v = new Vector(0, 0);
      v.setMag(separation);
      v.setHeading(this.angle);
      v.add(this.position);
      this.points.push(new Point(v.x, v.y));
    }
    this.points[0].pinned = true;
    for (let i = 0; i < this.divisions - 1; i++) {
      this.links.push(new Link(this.points[i], this.points[i + 1]));
    }
  }

  update() {
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];

      if (point.pinned) continue;
      let velocity = point.position.copy();
      velocity.sub(point.old_position);
      velocity.mult(0.98);
      point.old_position = point.position.copy();
      point.position.add(velocity);

      point.position.x += Math.cos(this.angle) * (this.stiffness / i);
      point.position.y += Math.sin(this.angle) * (this.stiffness / i);

      let distance = point.position.dist(cursor);

      if (distance < force_contact.size) {
        let force = new Vector();

        let angle = point.position.angle(cursor);
        force.setMag(Util.map(distance, 0, force_contact.size, 1.6, 0));
        force.setHeading(angle);
        point.position.sub(force);
      }

      point.position.add(wind.value);
      point.position.add(gravity);
    }
    for (let i = 0; i < 5; i++) {
      this.links.forEach(link => {
        let distance = link.p0.position.dist(link.p1.position),
          difference = link.length - distance,
          percent = difference / distance / 2;
        let offset = new Vector(
          (link.p1.position.x - link.p0.position.x) * percent,
          (link.p1.position.y - link.p0.position.y) * percent
        );
        if (!link.p0.pinned) {
          link.p0.position.sub(offset);
        }
        if (!link.p1.pinned) {
          link.p1.position.add(offset);
        }
      });
    }
  }

  draw() {
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    smoothLine(this.points.map(point => point.position));
    ctx.stroke();
    // head
    ctx.fillStyle = "#c2daf0";
    ctx.beginPath();
    ctx.arc(
      this.points[this.points.length - 1].position.x,
      this.points[this.points.length - 1].position.y,
      this.head_size,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(
      this.points[this.points.length - 1].position.x,
      this.points[this.points.length - 1].position.y,
      this.head_size*1.2,
      0,
      2 * Math.PI
    );
    ctx.fill();

  }
}

let tige_colors = ["#202236", "#362520", "#57374c"];

let field = {
  plants: [],
  init: function() {
    this.plants = [];
    let div = Math.floor(Util.random(16, 16));
    noise.seed(Math.random());

    let perspective = Util.random(0.5, 1);

    for (let y = H; y > 0; y -= div) {
      for (let x = W; x > 0; x -= div) {
        let new_pos = new Vector(
          x + Util.random(0, div),
          y + Util.random(0, div)
        );
        let center = new Vector(W / 2, H / 2);
        let min_distance = Math.min(W / 2, H / 2);
        let distance_from_center = new_pos.dist(center);
        let noise_value = noise.simplex2(x / 100, y / 100);
        let new_size =
          Math.abs(noise_value) *
          Util.map(distance_from_center, 0, min_distance, 16, 2);
        if (distance_from_center > min_distance || new_size < 4) continue;

        new_pos.y *= perspective;
        new_pos.y -= H / 2 * perspective - H / 2;

        if (Util.random(0, 1) > 0.97) {
          let d = new Dandelion(new_pos.x, new_pos.y, new_size);
          d.color = tige_colors[Math.floor(Util.random(0, tige_colors.length))];
          this.plants.unshift(d);

          let b = new Blade(new_pos.x, new_pos.y, new_size * 1.2);
          b.color = lerpColor(
            "#095880",
            "#33b03b",
            Util.map(distance_from_center, 0, min_distance, 1, 0)
          );
          b.thickness *= Util.random(1.2, 2.4);
          this.plants.unshift(b);
        } else {
          let b = new Blade(new_pos.x, new_pos.y, new_size);
          b.color = lerpColor(
            "#095880",
            "#33b03b",
            Util.map(distance_from_center, 0, min_distance, 1, 0)
          );
          if (Util.random(0, 1) > 0.9) {
            b.color = lerpColor(
              "#a83d16",
              "#33b03b",
              Util.map(distance_from_center, 0, min_distance, 1, 0)
            );
          }
          this.plants.unshift(b);
        }
        /*
        if(y <H/2){
        b.color = lerpColor(
              "#fff9ed",
              b.color,
              Util.map(y, 0, H/2, 0, 1)
            );
      }*/
      }
    }
  },
  render: function() {
    this.plants.forEach(plant => {
      plant.draw();
    });
    this.plants.forEach(plant => {
      plant.update();
    });
  }
};

field.init();

let wind = {
  value: new Vector(0, 0),
  reset: function() {
    this.time_start = new Date();
    this.start = this.value.x;
    this.duration = Util.random(200, 2000);
    this.goal = Util.random(-0.4, 0.4);
  },
  update: function() {
    let time = new Date() - this.time_start;
    if (time < this.duration) {
      this.value.x = Tween.linear(
        time,
        this.start,
        this.goal - this.start,
        this.duration
      );
    } else {
      setTimeout(() => {
        this.reset();
      }, Util.random(100, 3000));
    }
  }
};
wind.reset();

let force_contact = {
  size: 200,
  center: new Vector(W / 2, H / 2),
  draw: function() {
    let opacity = Util.map(
      cursor.dist(this.center),
      Math.min(W / 4, H / 4),
      Math.min(W / 2, H / 2),
      0.3,
      0
    );

    ctx.fillStyle = "rgba(20,40,20," + opacity + ")";
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 30, 0, 2 * Math.PI);
    ctx.fill();
  }
};

update();

function update() {
  ctx.clearRect(0, 0, W, H);
  field.render();
  wind.update();
  force_contact.draw();
  requestAnimationFrame(update);
}

function stroke(points, max_width) {
  let side_1 = [];
  let side_2 = [];
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let angle = 0;
    if (i === 0) {
      // first point
      angle = p.angle(points[i + 1]) + Math.PI / 2;
    } else if (i === points.length - 1) {
      // last point
      angle = p.angle(points[i - 1]) - Math.PI / 2;
    } else {
      // intermediate point
      let small = Math.max(p.angle(points[i + 1]), points[i - 1].angle(p));
      angle = small + Util.threeAngle(points[i - 1], p, points[i + 1]) / 2;
    }
    let target = points.length - 1;
    let width = Tween.easeInOutQuad(i, 0, target - i, target) * max_width;
    // let width = Util.lerp(60, 0, i / points.length+1);

    p_1 = new Vector(0, 0);
    p_1.setMag(width);
    p_1.setHeading(angle);
    p_1.add(p);

    p_2 = new Vector(0, 0);
    p_2.setMag(width);
    p_2.setHeading(angle + Math.PI);
    p_2.add(p);

    side_1.push(p_1);
    side_2.unshift(p_2);
  }
  ctx.beginPath();
  ctx.moveTo(side_1[0].x, side_1[0].y);
  smoothEdges(side_1);
  ctx.lineTo(side_2[0].x, side_2[0].y);
  smoothEdges(side_2);
  ctx.moveTo(side_2[side_2.length - 1].x, side_2[side_2.length - 1].y);
  ctx.lineTo(side_1[0].x, side_1[0].y);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

function smoothEdges(points) {
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y
  );
}

function smoothLine(points) {
  ctx.moveTo(points[0].x, points[0].y);
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y
  );
}

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae

function lerpColor(a, b, amount) {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
}
