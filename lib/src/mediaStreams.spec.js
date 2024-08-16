import EventEmitter from 'events';
import { faker } from '@faker-js/faker';
import { default as MediaStreams, MediaStreamsImpl, Browsers, WebPhoneRTPReport } from './mediaStreams';
import { Events } from './events';
// #region Mocks
class MockLogger {
    log;
    debug;
    error;
    info;
    constructor() {
        this.log = () => null;
        this.debug = () => null;
        this.error = () => null;
        this.info = () => null;
    }
}
class MockSessionDescriptionHandler {
    peerConnection;
    constructor() {
        this.peerConnection = new MockPeerConnection();
    }
}
class MockUserAgent {
    logger;
    defaultHeaders;
    constructor() {
        this.logger = new MockLogger();
        this.defaultHeaders = {};
    }
}
class MockSession {
    sessionDescriptionHandler;
    userAgent;
    logger;
    eventEmitter = new EventEmitter();
    constructor() {
        this.sessionDescriptionHandler = new MockSessionDescriptionHandler();
        this.userAgent = new MockUserAgent();
        this.logger = new MockLogger();
    }
    emit(event, parameter) {
        this.eventEmitter.emit(event, parameter);
    }
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    reinvite() { }
}
class MockPeerConnection {
    static iceConnectionStates = {
        new: 'mediaConnectionStateNew',
        checking: 'mediaConnectionStateChecking',
        connected: 'mediaConnectionStateConnected',
        completed: 'mediaConnectionStateCompleted',
        failed: 'mediaConnectionStateFailed',
        disconnected: 'mediaConnectionStateDisconnected',
        closed: 'mediaConnectionStateClosed',
    };
    static defaultStats = [
        {
            type: 'inbound-rtp',
            bytesReceived: 100,
            packetsReceived: 200,
            jitter: 300,
            packetsLost: 400,
            fractionLost: 500,
            mediaType: 'audio',
        },
        {
            type: 'outbound-rtp',
            bytesSent: 100,
            packetsSent: 200,
            mediaType: 'audio',
        },
        {
            type: 'candidate-pair',
            currentRoundTripTime: 1.05,
        },
    ];
    connectionState = 'new';
    eventEmitter = new EventEmitter();
    set iceConnectionState(state) {
        this.connectionState = state;
    }
    get iceConnectionState() {
        return this.connectionState;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getStats() {
        return new Promise((resolve) => {
            resolve(MockPeerConnection.defaultStats);
        });
    }
    addEventListener(eventName, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener) {
        this.eventEmitter.addListener(eventName, listener);
    }
    removeEventListener(eventName, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener) {
        this.eventEmitter.removeListener(eventName, listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(eventName, ...data) {
        this.eventEmitter.emit(eventName, data);
    }
}
const mockRtpStats = {
    'inbound-rtp': {
        type: 'inbound-rtp',
        bytesReceived: faker.number.int(),
        packetsReceived: faker.number.int(),
        jitter: faker.number.int(),
        packetsLost: faker.number.int(),
        fractionLost: faker.number.int(),
        mediaType: faker.word.sample(),
        roundTripTime: faker.number.int(),
    },
    'outbound-rtp': {
        type: 'outbound-rtp',
        bytesSent: faker.number.int(),
        packetsSent: faker.number.int(),
        mediaType: faker.word.sample(),
    },
    'candidate-pair': {
        type: 'candidate-pair',
        currentRoundTripTime: faker.number.int(),
    },
    'local-candidate': {
        type: 'local-candidate',
        id: faker.number.int(),
        isRemote: faker.datatype.boolean(),
        ip: faker.internet.ip(),
        candidateType: faker.word.sample(),
        networkType: faker.word.sample(),
        priority: faker.number.int(),
        port: faker.internet.port(),
    },
    'remote-candidate': {
        type: 'remote-candidate',
        id: faker.number.int(),
        isRemote: faker.datatype.boolean(),
        ip: faker.internet.ip(),
        candidateType: faker.word.sample(),
        priority: faker.number.int(),
        port: faker.internet.port(),
    },
    'media-source': {
        type: 'media-source',
        audioLevel: faker.number.int({ min: 0, max: 100 }),
    },
    track: {
        type: 'track',
        audioLevel: faker.number.int({ min: 0, max: 100 }),
    },
    transport: {
        type: 'transport',
        dtlsState: faker.word.sample(),
        packetsSent: faker.number.int(),
        packetsReceived: faker.number.int(),
        selectedCandidatePairChanges: faker.datatype.boolean(),
        selectedCandidatePairId: faker.number.int(),
    },
};
// #endregion
// (global as any).navigator = new MockNavigator() as unknown as Navigator;
function generateMockStatAndReport() {
    const inboundRTP = mockRtpStats['inbound-rtp'];
    const outboundRTP = mockRtpStats['outbound-rtp'];
    const candidatePair = mockRtpStats['candidate-pair'];
    const localCandidate = mockRtpStats['local-candidate'];
    const remoteCandidate = mockRtpStats['remote-candidate'];
    const mediaSource = mockRtpStats['media-source'];
    const track = mockRtpStats['track'];
    const transport = mockRtpStats['transport'];
    const mockStat = [
        inboundRTP,
        outboundRTP,
        candidatePair,
        localCandidate,
        remoteCandidate,
        mediaSource,
        track,
        transport,
    ];
    const mockReport = new WebPhoneRTPReport();
    mockReport.outboundRtpReport = {
        bytesSent: outboundRTP.bytesSent,
        packetsSent: outboundRTP.packetsSent,
        mediaType: outboundRTP.mediaType,
        rtpLocalAudioLevel: mediaSource.audioLevel,
    };
    mockReport.inboundRtpReport = {
        bytesReceived: inboundRTP.bytesReceived,
        packetsReceived: inboundRTP.packetsReceived,
        jitter: inboundRTP.jitter,
        packetsLost: inboundRTP.packetsLost,
        fractionLost: inboundRTP.fractionLost,
        mediaType: inboundRTP.mediaType,
    };
    mockReport.rttMs = {
        roundTripTime: inboundRTP.roundTripTime,
        currentRoundTripTime: candidatePair.currentRoundTripTime * 1000,
    };
    mockReport.localCandidates = [
        {
            id: localCandidate.id,
            isRemote: localCandidate.isRemote,
            ip: localCandidate.ip,
            candidateType: localCandidate.candidateType,
            networkType: localCandidate.networkType,
            priority: localCandidate.priority,
            port: localCandidate.port,
        },
    ];
    mockReport.remoteCandidates = [
        {
            id: remoteCandidate.id,
            isRemote: remoteCandidate.isRemote,
            ip: remoteCandidate.ip,
            candidateType: remoteCandidate.candidateType,
            priority: remoteCandidate.priority,
            port: remoteCandidate.port,
        },
    ];
    mockReport.transport = {
        dtlsState: transport.dtlsState,
        packetsSent: transport.packetsSent,
        packetsReceived: transport.packetsReceived,
        selectedCandidatePairChanges: transport.selectedCandidatePairChanges,
        selectedCandidatePairId: transport.selectedCandidatePairId,
    };
    return { mockStat, mockReport };
}
describe('MediaStreamsImpl', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('throw error if MediaStreamsImpl is instantiated with no session', () => {
        expect(() => new MediaStreamsImpl(null)).toThrow();
        expect(() => new MediaStreamsImpl(undefined)).toThrow();
    });
    test('browser function should check for correct browser type as per the useragent', () => {
        const mockSession = new MockSession();
        const mediaStreamsImpl = new MediaStreamsImpl(mockSession);
        jest
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue('Firefox/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725');
        expect(mediaStreamsImpl.browser()).toBe(Browsers.Firefox);
        jest
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue('Safari/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725');
        expect(mediaStreamsImpl.browser()).toBe(Browsers.Safari);
        jest
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue('Opera/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725');
        expect(mediaStreamsImpl.browser()).toBe(Browsers.Opera);
        jest
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue('MSIE/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725');
        expect(mediaStreamsImpl.browser()).toBe(Browsers.MSIE);
    });
    test('should emit event on session and trigger onMediaConnectionStateChange on iceconnectionstatechange', () => {
        const mockSession = new MockSession();
        const mediaStreamsImpl = new MediaStreamsImpl(mockSession);
        const mockOnMediaConnectionStateChange = jest.fn();
        mediaStreamsImpl.onMediaConnectionStateChange = mockOnMediaConnectionStateChange;
        const mediaConnectionStateNew = jest.fn();
        const mediaConnectionStateChecking = jest.fn();
        const mediaConnectionStateConnected = jest.fn();
        const mediaConnectionStateCompleted = jest.fn();
        const mediaConnectionStateFailed = jest.fn();
        const mediaConnectionStateDisconnected = jest.fn();
        const mediaConnectionStateClosed = jest.fn();
        mockSession.on('mediaConnectionStateNew', mediaConnectionStateNew);
        mockSession.on('mediaConnectionStateChecking', mediaConnectionStateChecking);
        mockSession.on('mediaConnectionStateConnected', mediaConnectionStateConnected);
        mockSession.on('mediaConnectionStateCompleted', mediaConnectionStateCompleted);
        mockSession.on('mediaConnectionStateFailed', mediaConnectionStateFailed);
        mockSession.on('mediaConnectionStateDisconnected', mediaConnectionStateDisconnected);
        mockSession.on('mediaConnectionStateClosed', mediaConnectionStateClosed);
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('new');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateNew', mockSession);
        expect(mediaConnectionStateNew).toBeCalled();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('checking');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateChecking', mockSession);
        expect(mediaConnectionStateChecking).toBeCalled();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('connected');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateConnected', mockSession);
        expect(mediaConnectionStateConnected).toBeCalled();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('completed');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateCompleted', mockSession);
        expect(mediaConnectionStateCompleted).toBeCalled();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('failed');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateFailed', mockSession);
        expect(mediaConnectionStateFailed).toBeCalled();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('disconnected');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateDisconnected', mockSession);
        expect(mediaConnectionStateDisconnected).toBeCalled();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('closed');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateClosed', mockSession);
        expect(mediaConnectionStateClosed).toBeCalled();
    });
    test('should not emit event on session and trigger onMediaConnectionStateChange on iceconnectionstatechange for unknown events', () => {
        const mockSession = new MockSession();
        const mediaStreamsImpl = new MediaStreamsImpl(mockSession);
        const mockOnMediaConnectionStateChange = jest.fn();
        mediaStreamsImpl.onMediaConnectionStateChange = mockOnMediaConnectionStateChange;
        const sessionEventListener = jest.fn();
        mockSession.on('mediaConnectionStateNew', sessionEventListener);
        mockSession.on('mediaConnectionStateChecking', sessionEventListener);
        mockSession.on('mediaConnectionStateConnected', sessionEventListener);
        mockSession.on('mediaConnectionStateCompleted', sessionEventListener);
        mockSession.on('mediaConnectionStateFailed', sessionEventListener);
        mockSession.on('mediaConnectionStateDisconnected', sessionEventListener);
        mockSession.on('mediaConnectionStateClosed', sessionEventListener);
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('randomEvent');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledTimes(0);
        expect(sessionEventListener).toBeCalledTimes(0);
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('kylo-ren-event');
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledTimes(0);
        expect(sessionEventListener).toBeCalledTimes(0);
    });
});
describe('MediaStreams', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });
    test('should send reinvite when reconnecting media', async () => {
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreamsImpl(mockSession);
        const mockReinvite = jest.fn().mockReturnValue(Promise.resolve(null));
        mockSession.reinvite = mockReinvite;
        await mediaStreams.reconnectMedia();
        expect(mockReinvite).toBeCalled();
    });
    test('should cleanup on release', (done) => {
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession);
        mediaStreams.mediaStreamsImpl['mediaStatsTimer'] = 123;
        const mockRemoveEventListener = (event, fn) => {
            expect(fn).toBe(mediaStreams.mediaStreamsImpl['onPeerConnectionStateChange']);
            expect(mediaStreams.mediaStreamsImpl['mediaStatsTimer']).toBe(null);
            done();
        };
        mockSession.sessionDescriptionHandler.peerConnection.removeEventListener = mockRemoveEventListener;
        mediaStreams.release();
    });
    test('getMediaStats should be called and rtpStat event should be emitted continuously as per the interval', async () => {
        jest.useFakeTimers();
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession);
        const getStatsCallback = jest.fn();
        const rtpStatCallback = jest.fn();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('connected');
        mockSession.on(Events.Session.RTPStat, rtpStatCallback);
        mediaStreams.getMediaStats(getStatsCallback, 100);
        jest.advanceTimersByTime(400);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        expect(getStatsCallback).toBeCalledTimes(4);
        expect(rtpStatCallback).toBeCalledTimes(4);
        await mediaStreams.release();
        getStatsCallback.mockClear();
        rtpStatCallback.mockClear();
        mediaStreams.getMediaStats(getStatsCallback, 50);
        jest.advanceTimersByTime(400);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        expect(getStatsCallback).toBeCalledTimes(8);
        expect(rtpStatCallback).toBeCalledTimes(8);
        mediaStreams.release();
    });
    test('should stop sending stats when stopMediaStats is called', async () => {
        jest.useFakeTimers();
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession);
        const getStatsCallback = jest.fn();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('connected');
        mediaStreams.getMediaStats(getStatsCallback, 100);
        jest.advanceTimersByTime(400);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        jest.advanceTimersByTime(400);
        mediaStreams.stopMediaStats();
        jest.advanceTimersByTime(400);
        expect(getStatsCallback).toBeCalledTimes(4);
        await mediaStreams.release();
    });
    test('should send media stats', async () => {
        jest.useFakeTimers();
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession);
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get')
            .mockReturnValue('connected');
        const { mockStat: firstStat, mockReport: firstReport } = generateMockStatAndReport();
        const { mockStat: secondStat, mockReport: secondReport } = generateMockStatAndReport();
        jest
            .spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'getStats')
            .mockReturnValueOnce(Promise.resolve(firstStat))
            .mockReturnValueOnce(Promise.resolve(secondStat));
        const getStatsCallback = jest.fn();
        mediaStreams.getMediaStats(getStatsCallback, 100);
        jest.advanceTimersByTime(200);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        expect(getStatsCallback).toHaveBeenNthCalledWith(1, firstReport, mockSession);
        expect(getStatsCallback).toHaveBeenNthCalledWith(2, secondReport, mockSession);
        await mediaStreams.release();
    });
});
