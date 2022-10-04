export enum JobQueue {
  SIMULATION = "Simulation",
  AUDIT_LOG = "AuditLog",
}

export enum DroneState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  LOADED = "LOADED",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  RETURNING = "RETURNING",
}

export enum DbDroneState {
  IDLE = "1",
  LOADING = "2",
  LOADED = "3",
  DELIVERING = "4",
  DELIVERED = "5",
  RETURNING = "6",
}

export const DroneStateMap: { [id: string]: string } = {
  IDLE: "1",
  LOADING: "2",
  LOADED: "3",
  DELIVERING: "4",
  DELIVERED: "5",
  RETURNING: "6",
};

export const DroneModelMap: { [id: string]: string } = {
  Lightweight: "1",
  Middleweight: "2",
  Cruiserweight: "3",
  Heavyweight: "4",
};
