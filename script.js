const graph = {};
const nodePositions = {};
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

function addEdge() {
    const from = document.getElementById("fromNode").value;
    const to = document.getElementById("toNode").value;
    const cost = parseInt(document.getElementById("cost").value);

    if (!from || !to || isNaN(cost)) {
        alert("Please enter valid nodes and cost.");
        return;
    }

    if (!graph[from]) graph[from] = [];
    graph[from].push({ node: to, cost });

    if (!graph[to]) graph[to] = [];
    graph[to].push({ node: from, cost });

    if (!nodePositions[from]) nodePositions[from] = randomPosition();
    if (!nodePositions[to]) nodePositions[to] = randomPosition();

    drawGraph();
    clearInputs();
}

function resetGraph() {
    Object.keys(graph).forEach(key => delete graph[key]);
    Object.keys(nodePositions).forEach(key => delete nodePositions[key]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetOutput();
    alert("Graph has been reset.");
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    for (let node in graph) {
        const [x1, y1] = nodePositions[node];
        for (let neighbor of graph[node]) {
            const [x2, y2] = nodePositions[neighbor.node];
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "#333";
            ctx.stroke();

            // Display edge cost
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            ctx.fillStyle = "red";
            ctx.fillText(neighbor.cost, midX, midY);
        }
    }

    // Draw nodes
    for (let node in nodePositions) {
        const [x, y] = nodePositions[node];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#007bff";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillText(node, x - 5, y + 5);
    }
}

function randomPosition() {
    return [
        Math.floor(Math.random() * (canvas.width - 40) + 20),
        Math.floor(Math.random() * (canvas.height - 40) + 20)
    ];
}

function bfs(start, goal) {
    const visited = new Set();
    const queue = [[start, [], 0]];
    let steps = 0;

    while (queue.length > 0) {
        steps++;
        const [current, path, cost] = queue.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        const newPath = [...path, current];
        if (current === goal) return { path: newPath, cost, steps };

        if (graph[current]) {
            for (const neighbor of graph[current]) {
                queue.push([neighbor.node, newPath, cost + neighbor.cost]);
            }
        }
    }
    return { path: [], cost: 0, steps };
}

function dfs(start, goal) {
    const visited = new Set();
    const stack = [[start, [], 0]];
    let steps = 0;

    while (stack.length > 0) {
        steps++;
        const [current, path, cost] = stack.pop();

        if (visited.has(current)) continue;
        visited.add(current);

        const newPath = [...path, current];
        if (current === goal) return { path: newPath, cost, steps };

        if (graph[current]) {
            for (const neighbor of graph[current]) {
                stack.push([neighbor.node, newPath, cost + neighbor.cost]);
            }
        }
    }
    return { path: [], cost: 0, steps };
}

function ucs(start, goal) {
    const priorityQueue = [{ node: start, cost: 0, path: [] }];
    const visited = new Set();
    let steps = 0;

    while (priorityQueue.length > 0) {
        steps++;
        priorityQueue.sort((a, b) => a.cost - b.cost);
        const { node: current, cost, path } = priorityQueue.shift();

        if (visited.has(current)) continue;
        visited.add(current);

        const newPath = [...path, current];
        if (current === goal) return { path: newPath, cost, steps };

        if (graph[current]) {
            for (const neighbor of graph[current]) {
                priorityQueue.push({
                    node: neighbor.node,
                    cost: cost + neighbor.cost,
                    path: newPath
                });
            }
        }
    }
    return { path: [], cost: 0, steps };
}

function startBFS() {
    const startNode = prompt("Enter the start node for BFS:");
    const goalNode = prompt("Enter the goal node for BFS:");
    if (!startNode || !goalNode) {
        alert("Start and goal nodes are required.");
        return;
    }
    const result = bfs(startNode, goalNode);
    displayResult(result);
}

function startDFS() {
    const startNode = prompt("Enter the start node for DFS:");
    const goalNode = prompt("Enter the goal node for DFS:");
    if (!startNode || !goalNode) {
        alert("Start and goal nodes are required.");
        return;
    }
    const result = dfs(startNode, goalNode);
    displayResult(result);
}

function startUCS() {
    const startNode = prompt("Enter the start node for UCS:");
    const goalNode = prompt("Enter the goal node for UCS:");
    if (!startNode || !goalNode) {
        alert("Start and goal nodes are required.");
        return;
    }
    const result = ucs(startNode, goalNode);
    displayResult(result);
}

function displayResult({ path, cost, steps }) {
    document.getElementById("path").innerText = `Path: ${path.join(" -> ")}`;
    document.getElementById("cost").innerText = `Cost: ${cost}`;
    document.getElementById("time").innerText = `Time Complexity: ${steps} steps`;
}

function clearInputs() {
    document.getElementById("fromNode").value = "";
    document.getElementById("toNode").value = "";
    document.getElementById("cost").value = "";
}

function resetOutput() {
    document.getElementById("path").innerText = "Path: ";
    document.getElementById("cost").innerText = "Cost: ";
    document.getElementById("time").innerText = "Time Complexity: ";
}
