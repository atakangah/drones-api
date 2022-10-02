export interface IDroneRegisterMockRequest {
  body: {
    serialNumber: string;
    model: string;
    weightLimit: number;
    batteryPercentage: number;
  };
}

export interface IDroneLoadMockRequest {
  body: {
    droneSerialNumber: string;
    medicationsNames: string[];
  };
}

export interface IDroneCargoMockRequest {
    query: any;
}

type JSONResponder = Function;
export interface IMockResponse {
  status: JSONResponder;
}
