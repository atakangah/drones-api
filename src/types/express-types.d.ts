export interface IDroneRegisterRequest {
  body: {
    serialNumber: string;
    model: string;
    weightLimit: number;
    batteryPercentage: number;
  };
}

export interface IDroneLoadRequest {
  body: {
    droneSerialNumber: string;
    medicationsNames: string[];
  };
}

export interface IDroneCargoRequest {
    query: any;
}

type JSONResponder = Function;
export interface IResponse {
  status: JSONResponder;
}
