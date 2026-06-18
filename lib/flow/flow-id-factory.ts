export type FlowIdFactory = () => string;

export const defaultFlowIdFactory: FlowIdFactory = () => crypto.randomUUID();
