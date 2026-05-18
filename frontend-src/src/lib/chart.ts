// Tiny SVG chart helpers reused by the growth-chart component.

export interface Point {
    x: number;
    y: number;
}

export function fitToBox(
    points: Point[],
    width: number,
    height: number,
    padding = 8
): Point[] {
    if (points.length === 0) return [];
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    return points.map(({ x, y }) => ({
        x: padding + ((x - minX) / rangeX) * innerW,
        y: padding + innerH - ((y - minY) / rangeY) * innerH
    }));
}

export function pathFromPoints(points: Point[]): string {
    if (points.length === 0) return "";
    const [first, ...rest] = points;
    return [`M${first.x},${first.y}`, ...rest.map((p) => `L${p.x},${p.y}`)].join(
        " "
    );
}
