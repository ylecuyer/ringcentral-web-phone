import type { WebPhoneSession } from './session';
export declare const startQosStatsCollection: (session: WebPhoneSession) => void;
export interface QosStats {
    localAddr: string;
    remoteAddr: string;
    callID: string;
    localID: string;
    remoteID: string;
    origID: string;
    fromTag: string;
    toTag: string;
    timestamp: {
        start: string;
        stop: string;
    };
    netType: any;
    jitterBufferNominal: number;
    jitterBufferMax: number;
    jitterBufferDiscardRate: number;
    totalSumJitter: number;
    totalIntervalCount: number;
    NLR: string;
    JBM: number;
    JBN: string;
    JDR: string;
    MOSLQ: number;
    MOSCQ: number;
    RTD: number;
    status: boolean;
    localcandidate: any;
    remotecandidate: any;
    inboundPacketsLost: number;
    inboundPacketsReceived: number;
    outboundPacketsLost: number;
    outboundPacketsSent: number;
}
