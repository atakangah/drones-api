export interface IMockRequest {
  body: {
    serialNumber: string;
    model: string;
    weightLimit: number;
    batteryPercentage: number;
  };
}

type JSONResponder = Function;
export interface IMockResponse {
    status: JSONResponder
}
