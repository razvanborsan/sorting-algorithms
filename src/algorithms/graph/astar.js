import BinaryHeap from 'structures/BinaryHeap';

import { getNodeKey } from 'components/GraphVisualizer/helpers';
import { getDijkstraDelay } from 'shared/variables';

const getEuclidianDistance = (node, end) => {
  const p1 = node.coords.row;
  const p2 = node.coords.col;

  const q1 = end.coords.row;
  const q2 = end.coords.col;

  return Math.sqrt((q1 - p1) ** 2 + (q2 - p2) ** 2);
};

export default function astar(
  adjacencyList,
  start,
  end,
  handleSetVisitedNodes,
  handleSetAdjacencyList,
) {
  // Deep clone the adjacency list so we never modify it directly
  const deepCloneAdjacencyList = new Map();
  adjacencyList.forEach((value, key) => {
    deepCloneAdjacencyList.set(key, value);
  });

  let keyframeDelay = 0;
  let isTargetFound = false;
  const visited = [];
  const priorityQueue = new BinaryHeap((x) => x.cost + x.heuristic);
  const deepCloneStartNode = deepCloneAdjacencyList.get(getNodeKey(start));
  const deepCloneEndNode = deepCloneAdjacencyList.get(getNodeKey(end));

  deepCloneStartNode.neighbours.forEach((neighbour) =>
    priorityQueue.push({
      from: getNodeKey(start),
      to: getNodeKey(neighbour),
      cost: neighbour.weight,
      heuristic: 15 * getEuclidianDistance(neighbour, deepCloneEndNode),
    }),
  );

  deepCloneStartNode.controlState.isVisited = true;
  visited.push(deepCloneStartNode);

  while (priorityQueue.size()) {
    const highestPriority = priorityQueue.pop();

    const previousNodeKey = highestPriority.from;
    const currentNodeKey = highestPriority.to;
    const previousNode = deepCloneAdjacencyList.get(previousNodeKey);
    const currentNode = deepCloneAdjacencyList.get(currentNodeKey);

    if (!currentNode.controlState.isVisited && !isTargetFound) {
      // Remember the fastest route from the current node to the start node
      previousNode.routeToStart.forEach((value, key) => {
        currentNode.routeToStart.set(key, value);
      });
      currentNode.routeToStart.set(getNodeKey(previousNode), previousNode);

      // Add animation delay
      keyframeDelay = getDijkstraDelay(highestPriority.cost);
      currentNode.delays.keyframeDelay = keyframeDelay;

      // Mark the closest node as visited
      currentNode.controlState.isVisited = true;
      visited.push(currentNode);

      // If we found our destination, set isTargetFound as true
      if (currentNode.controlState.isEnd) {
        isTargetFound = true;
      }

      // Go through each neighbour and, if not yet visited, add it to the priority queue
      const { neighbours } = currentNode;
      neighbours.forEach((neighbour) => {
        if (!neighbour.controlState.isVisited) {
          currentNode.cost = highestPriority.cost + neighbour.weight;
          priorityQueue.push({
            from: getNodeKey(currentNode),
            to: getNodeKey(neighbour),
            cost: highestPriority.cost + neighbour.weight,
            heuristic: 15 * getEuclidianDistance(neighbour, deepCloneEndNode),
          });
        }
      });
    }
  }

  // remove the surplus animation delay from the final route animation
  let dissipatedNodes = 0;
  let endNode = null;
  deepCloneAdjacencyList.forEach((node) => {
    if (node.controlState.isEnd) {
      endNode = node;
    }
  });

  // Go through each node of the final route
  endNode.routeToStart.forEach((node) => {
    // Count the number of weighted nodes
    if (node.controlState.isWeighted) {
      dissipatedNodes += 1;
    }

    node.controlState.isPartOfFinalRoute = true;

    // remove the waiting animation from the final route
    node.delays.finalRouteKeyframeDelay =
      keyframeDelay - dissipatedNodes * getDijkstraDelay(15);
  });

  handleSetAdjacencyList(deepCloneAdjacencyList);
  handleSetVisitedNodes([...visited]);
}
