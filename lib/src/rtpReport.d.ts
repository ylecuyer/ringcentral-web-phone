export interface RTPReport {
    outboundRtpReport: OutboundRtpReport;
    inboundRtpReport: InboundRtpReport;
    rttMs: RttReport;
    localCandidates?: object[];
    remoteCandidates?: object[];
    transport?: any;
}
export interface InboundRtpReport {
    mediaType?: string;
    packetsReceived?: number;
    bytesReceived?: number;
    packetsLost?: number;
    jitter?: number;
    fractionLost?: number;
    roundTripTime?: number;
    rtpRemoteAudioLevel?: number;
}
export interface OutboundRtpReport {
    mediaType?: string;
    packetsSent?: number;
    bytesSent?: number;
    rtpLocalAudioLevel?: number;
}
export interface RttReport {
    currentRoundTripTime?: number;
    roundTripTime?: number;
}
export declare function isNoAudio(report: RTPReport): boolean;
