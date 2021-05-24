function Point(x, y) {
  return {x: x, y: y};
}

function Circle(center, radius) {
  return { center: center, radius: radius };
}

function dist(a, b) {
  const xDiff = a.x - b.x;
  const yDiff = a.y - b.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function from2points(a, b) {
	// the center is the middle point between a and b
  const x = (a.x + b.x) / 2;
  const y = (a.y + b.y) / 2;
	// the radius is the distance between a and b
  const r = dist(a, b) / 2;
  return Circle(Point(x, y), r);
}

function from3points(a, b, c) {
  // find the circumcenter of the triangle a,b,c
  const mAB = Point((a.x + b.x) / 2, (a.y + b.y) / 2);
	const pSlopAB = (a.x - b.x) / (b.y - a.y);
	const mBC = Point((b.x + c.x) / 2, (b.y + c.y) / 2);
  const pSlopBC = (b.x - c.x) / (c.y - b.y);
	
	// if slopes are equal (or both are NaN, i.e. vertical)
	if ((pSlopAB === pSlopBC) || (pSlopAB !== pSlopAB && pSlopBC !== pSlopBC)) {
		const minX = Math.min(a.x, Math.min(b.x, c.x));
		const maxX = Math.max(a.x, Math.max(b.x, c.x));
		const x = (minX + maxX) / 2;
		const minY = Math.min(a.y, Math.min(b.y, c.y));
		const maxY = Math.max(a.y, Math.max(b.y, c.y));
		const y = (minY + maxY) / 2;
		const center = Point(x, y);
		const radius = dist(a, center);
		return Circle(center, radius);
	}
	// if only AB is vertical
	if (a.y === b.y) {
		const x = mAB.x;
		const y = pSlopBC * (x - mBC.x) + mBC.y;
		const center = Point(x, y);
		const radius = dist(a, center);
		return Circle(center, radius);
	}
	// if only BC is vertical
	if (b.y === c.y) {
		const x = mBC.x;
		const y = pSlopAB * (x - mAB.x) + mAB.y;
		const center = Point(x, y);
		const radius = dist(a, center);
		return Circle(center, radius);
	}

	// otherwise, the center can be calculated normally
	const x = (-pSlopBC * mBC.x + mBC.y + pSlopAB * mAB.x - mAB.y) / (pSlopAB - pSlopBC);
	const y = pSlopAB * (x - mAB.x) + mAB.y;
	const center = Point(x, y);
	const R = dist(center, a);
	return Circle(center, R);
}

function trivial(P) {
	// if P contains less than 3 points
  if (P.length === 0) {
    return Circle(Point(0, 0), 0);
  } else if (P.length === 1) {
    return Circle(P[0], 0);
  } else if (P.length === 2) {
    return from2points(P[0], P[1]);
  }

	// otherwise, consider every possible circle from 2 pair of points
  let c = from2points(P[0], P[1]);
  if (dist(P[2], c.center) <= c.radius) {
		return c;
  }
	c = from2points(P[0], P[2]);
	if (dist(P[1], c.center) <= c.radius) {
		return c;
  }
	c = from2points(P[1], P[2]);
	if (dist(P[0], c.center) <= c.radius) {
		return c;
  }
	// else find the unique circle from 3 points
	return from3points(P[0], P[1], P[2]);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// an implementation of welzl based on the wiki page
function welzl(P, R, n) {
  if (n <= 0 || R.length >= 3) {
    return trivial(R);
  }

  const i = getRandomInt(n);
  const p = P[i];
  P[i] = P[n - 1];
  P[n - 1] = p;
  const c = welzl(P, R, n - 1);

  if (dist(p, c.center) <= c.radius) {
    return c;
  }

  return welzl(P, [...R, p], n - 1);
}

// a wrapper for welzl
function findMinCircle(points) {
	const circle = welzl(points, [], points.length);
  return {x: circle.center.x, y: circle.center.y, r: radius};
}

module.exports = findMinCircle;