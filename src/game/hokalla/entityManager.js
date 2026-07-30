// Stub – will manage fighters, projectiles, etc. later.
const entities = [];

export function addEntity(entity) {
  entities.push(entity);
}

export function removeEntity(entity) {
  const index = entities.indexOf(entity);
  if (index > -1) entities.splice(index, 1);
}

export function getEntities() {
  return entities;
}

export function updateEntities(deltaTime) {
  // Update logic for all entities (future)
}