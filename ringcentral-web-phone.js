(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("sip.js"));
	else if(typeof define === 'function' && define.amd)
		define(["sip.js"], factory);
	else if(typeof exports === 'object')
		exports["RingCentral"] = factory(require("sip.js"));
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["WebPhone"] = factory(root["SIP"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_sip_js__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/audioHelper.ts":
/*!****************************!*\
  !*** ./src/audioHelper.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AudioHelper: () => (/* binding */ AudioHelper)
/* harmony export */ });
class AudioHelper {
    /** Current volume */
    volume;
    _enabled;
    _incoming;
    _outgoing;
    _audio;
    constructor(options = {}) {
        this._enabled = !!options.enabled;
        this.loadAudio(options);
    }
    /** Load incoming and outgoing audio files for feedback */
    loadAudio(options) {
        this._incoming = options.incoming;
        this._outgoing = options.outgoing;
        this._audio = {};
    }
    /** Set volume for incoming and outgoing feedback */
    setVolume(_volume) {
        let volume = _volume;
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }
        this.volume = volume;
        for (const url in this._audio) {
            if (Object.hasOwn(this._audio, url)) {
                this._audio[url].volume = volume;
            }
        }
    }
    /**
     * Play or pause incoming feedback
     * @param value `true` to play audio and `false` to pause
     * @returns
     */
    playIncoming(value) {
        return this._playSound(this._incoming, value, this.volume || 0.5);
    }
    /**
     * Play or pause outgoing feedback
     * @param value `true` to play audio and `false` to pause
     * @returns
     */
    playOutgoing(value) {
        return this._playSound(this._outgoing, value, this.volume || 1);
    }
    _playSound(url, val, volume) {
        if (!this._enabled || !url || !this._audio) {
            return this;
        }
        if (!this._audio[url]) {
            if (val) {
                this._audio[url] = new Audio();
                this._audio[url].src = url;
                this._audio[url].loop = true;
                this._audio[url].volume = volume;
                this._audio[url].playPromise = this._audio[url].play();
            }
        }
        else {
            if (val) {
                this._audio[url].currentTime = 0;
                this._audio[url].playPromise = this._audio[url].play();
            }
            else {
                const audio = this._audio[url];
                if (audio.playPromise !== undefined) {
                    audio.playPromise.then(() => {
                        audio.pause();
                    });
                }
            }
        }
        return this;
    }
}


/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultLogLevel: () => (/* binding */ defaultLogLevel),
/* harmony export */   defaultMediaConstraints: () => (/* binding */ defaultMediaConstraints),
/* harmony export */   defaultSipErrorCodes: () => (/* binding */ defaultSipErrorCodes),
/* harmony export */   defaultStunServers: () => (/* binding */ defaultStunServers),
/* harmony export */   messages: () => (/* binding */ messages),
/* harmony export */   responseTimeout: () => (/* binding */ responseTimeout),
/* harmony export */   uuidKey: () => (/* binding */ uuidKey)
/* harmony export */ });
const messages = {
    park: { reqid: 1, command: 'callpark' },
    startRecord: { reqid: 2, command: 'startcallrecord' },
    stopRecord: { reqid: 3, command: 'stopcallrecord' },
    flip: { reqid: 3, command: 'callflip', target: '' },
    monitor: { reqid: 4, command: 'monitor' },
    barge: { reqid: 5, command: 'barge' },
    whisper: { reqid: 6, command: 'whisper' },
    takeover: { reqid: 7, command: 'takeover' },
    toVoicemail: { reqid: 11, command: 'toVoicemail' },
    ignore: { reqid: 12, command: 'ignore' },
    receiveConfirm: { reqid: 17, command: 'receiveConfirm' },
    replyWithMessage: { reqid: 14, command: 'replyWithMessage' },
};
const uuidKey = 'rc-webPhone-uuid';
const responseTimeout = 60000;
const defaultMediaConstraints = {
    audio: true,
    video: false,
};
const defaultStunServers = ['stun.l.google.com:19302'];
const defaultSipErrorCodes = ['408', '502', '503', '504'];
const defaultLogLevel = 'debug';


/***/ }),

/***/ "./src/events.ts":
/*!***********************!*\
  !*** ./src/events.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Events: () => (/* binding */ Events)
/* harmony export */ });
/** @ignore */
const Events = {
    Transport: {
        Connecting: 'connecting',
        Connected: 'connected',
        Disconnecting: 'disconnecting',
        Disconnected: 'disconnected',
        ConnectionAttemptFailure: 'wsConnectionError',
        ConnectionFailure: 'transportError',
        SwitchBackToMainProxy: 'switchBackProxy',
        Closed: 'closed',
    },
    UserAgent: {
        Registered: 'registered',
        Unregistered: 'unregistered',
        RegistrationFailed: 'registrationFailed',
        InviteSent: 'inviteSent',
        Invite: 'invite',
        ProvisionUpdate: 'provisionUpdate',
        Started: 'started',
        Stopped: 'stopped',
    },
    Session: {
        Accepted: 'accepted',
        Progress: 'progress',
        Muted: 'muted',
        Unmuted: 'unmuted',
        Establishing: 'establishing',
        Established: 'established',
        Terminating: 'terminating',
        Terminated: 'terminated',
        UpdateReceived: 'updateReceived',
        MoveToRcv: 'moveToRcv',
        QOSPublished: 'qos-published',
        RTPStat: 'rtpStat',
        UserMediaFailed: 'userMediaFailed',
    },
};


/***/ }),

/***/ "./src/mediaStreams.ts":
/*!*****************************!*\
  !*** ./src/mediaStreams.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Browsers: () => (/* binding */ Browsers),
/* harmony export */   MediaStreams: () => (/* binding */ MediaStreams),
/* harmony export */   MediaStreamsImpl: () => (/* binding */ MediaStreamsImpl),
/* harmony export */   WebPhoneRTPReport: () => (/* binding */ WebPhoneRTPReport),
/* harmony export */   "default": () => (/* binding */ MediaStreams)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/events.ts");
/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */

var ConnectionState;
(function (ConnectionState) {
    ConnectionState["new"] = "mediaConnectionStateNew";
    ConnectionState["checking"] = "mediaConnectionStateChecking";
    ConnectionState["connected"] = "mediaConnectionStateConnected";
    ConnectionState["completed"] = "mediaConnectionStateCompleted";
    ConnectionState["failed"] = "mediaConnectionStateFailed";
    ConnectionState["disconnected"] = "mediaConnectionStateDisconnected";
    ConnectionState["closed"] = "mediaConnectionStateClosed";
})(ConnectionState || (ConnectionState = {}));
var Browsers;
(function (Browsers) {
    Browsers["MSIE"] = "IE";
    Browsers["Chrome"] = "Chrome";
    Browsers["Firefox"] = "Firefox";
    Browsers["Safari"] = "Safari";
    Browsers["Opera"] = "Opera";
})(Browsers || (Browsers = {}));
class WebPhoneRTPReport {
    outboundRtpReport = {};
    inboundRtpReport = {};
    rttMs = {};
    localCandidates = [];
    remoteCandidates = [];
    transport = {};
}
/** Media Streams class to monitor media stats */
class MediaStreams {
    /**
     * Reference to MediaStreamsImpl object. This Object has all the functions to handle media streams
     *
     * MediaStreams class is a wrapper around MediaStreamsImpl
     */
    mediaStreamsImpl;
    /** Remove iceconnectionstatechange event listeners and stop collecting stats */
    release;
    /**
     * Reconnect media and send reinvite on the existing session.
     *
     * This will also recreate SDP and send it over with the reinvite message
     */
    reconnectMedia;
    /**
     * @param callback function which will be called every time media stats are generated. Will override callback passed to `onRTPStat`
     * @param interval interval for the recurring call to the callback function
     * @returns
     */
    getMediaStats;
    /** Stop collecting stats */
    stopMediaStats;
    constructor(session) {
        this.mediaStreamsImpl = new MediaStreamsImpl(session);
        this.release = this.mediaStreamsImpl.release.bind(this.mediaStreamsImpl);
        this.reconnectMedia = this.mediaStreamsImpl.reconnectMedia.bind(this.mediaStreamsImpl);
        this.getMediaStats = this.mediaStreamsImpl.getMediaStats.bind(this.mediaStreamsImpl);
        this.stopMediaStats = this.mediaStreamsImpl.stopMediaStats.bind(this.mediaStreamsImpl);
    }
    /**
     * Set a function to be called when media stats are generated
     * @param callback optionally, you can set a function on MediaStreams object. This will be treated as a default callback when media stats are generated if a callback function is not passed with `getMediaStats` function
     */
    set onRTPStat(callback) {
        this.mediaStreamsImpl.onRTPStat = callback;
    }
    get onRTPStat() {
        return this.mediaStreamsImpl.onRTPStat;
    }
    /**
     * Set a function to be called when `peerConnetion` iceconnectionstatechange changes
     * @param callback function to be called when `peerConnetion` iceconnectionstatechange changes
     */
    set onMediaConnectionStateChange(callback) {
        this.mediaStreamsImpl.onMediaConnectionStateChange = callback;
    }
    get onMediaConnectionStateChange() {
        return this.mediaStreamsImpl.onMediaConnectionStateChange;
    }
}
/**
 * MediaStreams Implementation
 */
class MediaStreamsImpl {
    preRTT;
    /**
     * Set a function to be called when `peerConnection` iceconnectionstatechange changes
     *
     * @param callback function to be called when `peerConnection` iceconnectionstatechange changes
     */
    onMediaConnectionStateChange;
    /**
     * Set a function to be called when media stats are generated
     * @param callback optionally, you can set a function on MediaStreams object. This will be treated as a default callback when media stats are generated if a callback function is not passed with `getMediaStats` function
     */
    onRTPStat;
    ktag = 'MediaStreams';
    session;
    isChrome;
    isFirefox;
    isSafari;
    mediaStatsTimer;
    constructor(session) {
        this.ktag = 'MediaStreams';
        if (!session) {
            throw new Error(`${this.ktag}: Cannot initial media stream monitoring. Session is not passed`);
        }
        this.session = session;
        this.onMediaConnectionStateChange = undefined;
        this.onPeerConnectionStateChange = this.onPeerConnectionStateChange.bind(this);
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler;
        sessionDescriptionHandler.peerConnection.addEventListener('iceconnectionstatechange', this.onPeerConnectionStateChange);
        this.isChrome = this.browser() === Browsers.Chrome;
        this.isFirefox = this.browser() === Browsers.Firefox;
        this.isSafari = this.browser() === Browsers.Safari;
        this.preRTT = { currentRoundTripTime: 0 };
        if (!this.isChrome && !this.isFirefox && !this.isSafari) {
            this.session.logger.error(`${this.ktag} The web browser ${this.browser()} is not in the recommended list [Chrome, Safari, Firefox] !`);
        }
    }
    /**
     * @param callback function which will be called every time media stats are generated. Will override callback passed to `onRTPStat`
     * @param interval interval for the recurring call to the callback function
     * @returns
     */
    getMediaStats(callback, interval = 1000) {
        if (!this.onRTPStat && !callback) {
            this.session.logger.debug(`${this.ktag}: No event callback provided to call when media starts are generated`);
            return;
        }
        if (callback) {
            this.onRTPStat = callback;
        }
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.mediaStatsTimer = null;
        }
        this.mediaStatsTimer = setInterval(() => {
            this.mediaStatsTimerCallback();
        }, interval);
    }
    /**
     * Stop collecting stats. This will stop calling the registered function (either that was registered using `onRTPstat` or using `getMediaStats`)
     */
    stopMediaStats() {
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.onRTPStat = undefined;
        }
    }
    /**
     * Reconnect media and send reinvite on the existing session.
     *
     * This will also recreate SDP and send it over with the reinvite message
     */
    reconnectMedia() {
        return new Promise((resolve, reject) => {
            this.session.reinvite()
                .then(() => resolve())
                .catch(reject);
        });
    }
    /**
     * Remove iceconnectionstatechange event listeners and stop collecting stats
     */
    release() {
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.mediaStatsTimer = null;
        }
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler;
        if (!sessionDescriptionHandler.peerConnection) {
            return;
        }
        sessionDescriptionHandler.peerConnection.removeEventListener('iceconnectionstatechange', this.onPeerConnectionStateChange);
    }
    get tag() {
        return this.ktag;
    }
    /**
     * Function to find what browser is being used depending on the `navigator.userAgent` value
     * @returns Browsers enum value to denote what browser if being used
     */
    browser() {
        if (navigator.userAgent.search('MSIE') >= 0) {
            return Browsers.MSIE;
        }
        else if (navigator.userAgent.search('Chrome') >= 0) {
            return Browsers.Chrome;
        }
        else if (navigator.userAgent.search('Firefox') >= 0) {
            return Browsers.Firefox;
        }
        else if (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0) {
            return Browsers.Safari;
        }
        else if (navigator.userAgent.search('Opera') >= 0) {
            return Browsers.Opera;
        }
        return 'unknown';
    }
    mediaStatsTimerCallback() {
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler;
        const peerConnection = sessionDescriptionHandler.peerConnection;
        if (!peerConnection) {
            this.session.logger.error(`${this.ktag}: The peer connection cannot be null`);
            return;
        }
        const connectionState = peerConnection.iceConnectionState;
        if (connectionState !== 'connected' && connectionState !== 'completed') {
            this.preRTT.currentRoundTripTime = 0;
            return;
        }
        this.getRTPReport(new WebPhoneRTPReport());
    }
    onPeerConnectionStateChange() {
        let eventName = 'unknown';
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler;
        const state = sessionDescriptionHandler.peerConnection.iceConnectionState;
        if (Object.hasOwn(ConnectionState, state)) {
            eventName = ConnectionState[state];
            if (this.onMediaConnectionStateChange) {
                this.onMediaConnectionStateChange(eventName, this.session);
            }
            this.session.emit(eventName);
        }
        else {
            this.session.logger.debug(`${this.tag}: Unknown peerConnection state: ${state}`);
        }
        this.session.logger.debug(`${this.tag}: peerConnection State: ${state}`);
    }
    async getRTPReport(report) {
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler;
        const peerConnection = sessionDescriptionHandler.peerConnection;
        try {
            const stats = await peerConnection.getStats();
            stats.forEach((stat) => {
                switch (stat.type) {
                    case 'inbound-rtp':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'bytesReceived':
                                case 'packetsReceived':
                                case 'jitter':
                                case 'packetsLost':
                                case 'fractionLost':
                                case 'mediaType':
                                    report.inboundRtpReport[statName] = stat[statName];
                                    break;
                                case 'roundTripTime':
                                    report.rttMs[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    case 'outbound-rtp':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'bytesSent':
                                case 'packetsSent':
                                case 'mediaType':
                                    report.outboundRtpReport[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    case 'candidate-pair':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'currentRoundTripTime':
                                    report.rttMs[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    case 'local-candidate': {
                        const local_candidate = {};
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'id':
                                case 'isRemote':
                                case 'ip':
                                case 'candidateType':
                                case 'networkType':
                                case 'priority':
                                case 'port':
                                    local_candidate[statName] = stat[statName];
                                    break;
                            }
                        });
                        report.localCandidates.push(local_candidate);
                        break;
                    }
                    case 'remote-candidate': {
                        const remote_candidate = {};
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'id':
                                case 'isRemote':
                                case 'ip':
                                case 'priority':
                                case 'port':
                                case 'candidateType':
                                    remote_candidate[statName] = stat[statName];
                                    break;
                            }
                        });
                        report.remoteCandidates.push(remote_candidate);
                        break;
                    }
                    case 'media-source':
                        report.outboundRtpReport.rtpLocalAudioLevel = stat.audioLevel ? stat.audioLevel : 0;
                        break;
                    case 'track':
                        if (!stat.remoteSource) {
                            break;
                        }
                        report.inboundRtpReport.rtpRemoteAudioLevel = stat.audioLevel ? stat.audioLevel : 0;
                        break;
                    case 'transport':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'dtlsState':
                                case 'packetsSent':
                                case 'packetsReceived':
                                case 'selectedCandidatePairChanges':
                                case 'selectedCandidatePairId':
                                    report.transport[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    default:
                        break;
                }
            });
            if (!Object.hasOwn(report.rttMs, 'currentRoundTripTime')) {
                if (!Object.hasOwn(report.rttMs, 'roundTripTime')) {
                    report.rttMs.currentRoundTripTime = this.preRTT.currentRoundTripTime;
                }
                else {
                    report.rttMs.currentRoundTripTime = report.rttMs.roundTripTime; // for Firefox
                    delete report.rttMs.roundTripTime;
                }
            }
            else {
                report.rttMs.currentRoundTripTime = Math.round(report.rttMs.currentRoundTripTime * 1000);
            }
            if (Object.hasOwn(report.rttMs, 'currentRoundTripTime')) {
                this.preRTT.currentRoundTripTime = report.rttMs.currentRoundTripTime;
            }
            this.onRTPStat(report, this.session);
            this.session.emit(_events__WEBPACK_IMPORTED_MODULE_0__.Events.Session.RTPStat, report);
        }
        catch (e) {
            this.session.logger.error(`${this.tag}: Unable to get media stats: ${e.message}`);
        }
    }
}



/***/ }),

/***/ "./src/qos.ts":
/*!********************!*\
  !*** ./src/qos.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   startQosStatsCollection: () => (/* binding */ startQosStatsCollection)
/* harmony export */ });
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sip.js */ "sip.js");
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sip_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/events.ts");


const formatFloat = (input) => parseFloat(input.toString()).toFixed(2);
const startQosStatsCollection = (session) => {
    const qosStatsObj = getQoSStatsTemplate();
    qosStatsObj.callID = session.request.callId || '';
    qosStatsObj.fromTag = session.request.fromTag || '';
    qosStatsObj.toTag = session.request.toTag || '';
    qosStatsObj.localID = session.request.getHeader('From');
    qosStatsObj.remoteID = session.request.getHeader('To');
    qosStatsObj.origID = session.request.getHeader('From');
    const refreshIntervalId = setInterval(async () => {
        const sessionDescriptionHandler = session.sessionDescriptionHandler;
        if (!sessionDescriptionHandler?.peerConnection) {
            session.logger.error('There is no PeerConnection, can not getStats');
            return;
        }
        const getStatsResult = await sessionDescriptionHandler.peerConnection.getStats();
        session.logger.log(`getStatsResult ${JSON.stringify(getStatsResult)}`);
        qosStatsObj.status = true;
        let network = '';
        getStatsResult.forEach((item) => {
            switch (item.type) {
                case 'local-candidate':
                    if (item.candidateType === 'srflx') {
                        network = typeof item.networkType === 'string' ? item.networkType : getNetworkType(item.networkType);
                        qosStatsObj.localAddr = item.ip + ':' + item.port;
                        qosStatsObj.localcandidate = item;
                    }
                    break;
                case 'remote-candidate':
                    if (item.candidateType === 'host') {
                        qosStatsObj.remoteAddr = item.ip + ':' + item.port;
                        qosStatsObj.remotecandidate = item;
                    }
                    break;
                case 'inbound-rtp': {
                    qosStatsObj.jitterBufferDiscardRate = item.packetsDiscarded / item.packetsReceived;
                    qosStatsObj.inboundPacketsLost = item.packetsLost;
                    qosStatsObj.inboundPacketsReceived = item.packetsReceived; // packetsReceived
                    const jitterBufferMs = parseFloat(item.jitterBufferEmittedCount) > 0
                        ? (parseFloat(item.jitterBufferDelay) / parseFloat(item.jitterBufferEmittedCount)) * 1000
                        : 0;
                    qosStatsObj.totalSumJitter += jitterBufferMs;
                    qosStatsObj.totalIntervalCount += 1;
                    qosStatsObj.NLR = formatFloat((item.packetsLost / (item.packetsLost + item.packetsReceived)) * 100);
                    qosStatsObj.JBM = Math.max(qosStatsObj.JBM, jitterBufferMs);
                    qosStatsObj.netType = addToMap(qosStatsObj.netType, network);
                    break;
                }
                case 'candidate-pair':
                    qosStatsObj.RTD = Math.round((item.currentRoundTripTime / 2) * 1000);
                    break;
                case 'outbound-rtp':
                    qosStatsObj.outboundPacketsSent = item.packetsSent;
                    break;
                case 'remote-inbound-rtp':
                    qosStatsObj.outboundPacketsLost = item.packetsLost;
                    break;
                default:
                    break;
            }
        });
    }, session.userAgent.qosCollectInterval);
    session.stateChange.addListener((newState) => {
        if (newState === sip_js__WEBPACK_IMPORTED_MODULE_0__.SessionState.Terminated) {
            session.logger.log('Release media streams');
            session.mediaStreams?.release();
            publishQosStats(session, qosStatsObj);
            refreshIntervalId && clearInterval(refreshIntervalId);
        }
    });
};
const publishQosStats = async (session, qosStatsObj, _options = {}) => {
    const options = _options || {};
    const targetUrl = options.targetUrl || 'sip:rtcpxr@rtcpxr.ringcentral.com:5060';
    const event = options.event || 'vq-rtcpxr';
    options.expires = 60;
    options.contentType = 'application/vq-rtcpxr';
    options.extraHeaders = (options.extraHeaders || []).concat(session.userAgent.defaultHeaders);
    const cpuOS = session.__qosStats.cpuOS;
    const cpuRC = session.__qosStats.cpuRC;
    const ram = session.__qosStats.ram;
    const networkType = session.__qosStats.netType || calculateNetworkUsage(qosStatsObj) || '';
    let effectiveType = '';
    if ('connection' in navigator) {
        effectiveType = navigator.connection.effectiveType;
    }
    options.extraHeaders.push(`p-rc-client-info:cpuRC=${cpuRC};cpuOS=${cpuOS};netType=${networkType};ram=${ram};effectiveType=${effectiveType}`);
    session.logger.log(`QOS stats ${JSON.stringify(qosStatsObj)}`);
    const calculatedStatsObj = calculateStats(qosStatsObj);
    const body = createPublishBody(calculatedStatsObj);
    const publisher = new sip_js__WEBPACK_IMPORTED_MODULE_0__.Publisher(session.userAgent, sip_js__WEBPACK_IMPORTED_MODULE_0__.UserAgent.makeURI(targetUrl), event, options);
    await publisher.publish(body);
    session.logger.log('Local Candidate: ' + JSON.stringify(qosStatsObj.localcandidate));
    session.logger.log('Remote Candidate: ' + JSON.stringify(qosStatsObj.remotecandidate));
    qosStatsObj.status = false;
    await publisher.dispose();
    session.emit(_events__WEBPACK_IMPORTED_MODULE_1__.Events.Session.QOSPublished, body);
};
const calculateNetworkUsage = (qosStatsObj) => {
    const networkType = [];
    for (const [key, value] of Object.entries(qosStatsObj.netType)) {
        networkType.push(key + ':' + formatFloat((value * 100) / qosStatsObj.totalIntervalCount));
    }
    return networkType.join();
};
const calculateStats = (qosStatsObj) => {
    const rawNLR = (qosStatsObj.inboundPacketsLost * 100) / (qosStatsObj.inboundPacketsReceived + qosStatsObj.inboundPacketsLost) || 0;
    const rawJBN = qosStatsObj.totalIntervalCount > 0 ? qosStatsObj.totalSumJitter / qosStatsObj.totalIntervalCount : 0;
    return {
        ...qosStatsObj,
        NLR: formatFloat(rawNLR),
        JBN: formatFloat(rawJBN),
        JDR: formatFloat(qosStatsObj.jitterBufferDiscardRate),
        MOSLQ: calculateMos(qosStatsObj.inboundPacketsLost / (qosStatsObj.inboundPacketsLost + qosStatsObj.inboundPacketsReceived)),
        MOSCQ: calculateMos(qosStatsObj.outboundPacketsLost / (qosStatsObj.outboundPacketsLost + qosStatsObj.outboundPacketsSent)),
    };
};
const createPublishBody = (calculatedStatsObj) => {
    const NLR = calculatedStatsObj.NLR || 0;
    const JBM = calculatedStatsObj.JBM || 0;
    const JBN = calculatedStatsObj.JBN || 0;
    const JDR = calculatedStatsObj.JDR || 0;
    const MOSLQ = calculatedStatsObj.MOSLQ || 0;
    const MOSCQ = calculatedStatsObj.MOSCQ || 0;
    const RTD = calculatedStatsObj.RTD || 0;
    const callID = calculatedStatsObj.callID || '';
    const fromTag = calculatedStatsObj.fromTag || '';
    const toTag = calculatedStatsObj.toTag || '';
    const localId = calculatedStatsObj.localID || '';
    const remoteId = calculatedStatsObj.remoteID || '';
    const localAddr = calculatedStatsObj.localAddr || '';
    const remoteAddr = calculatedStatsObj.remoteAddr || '';
    return ('VQSessionReport: CallTerm\r\n' +
        `CallID: ${callID}\r\n` +
        `LocalID: ${localId}\r\n` +
        `RemoteID: ${remoteId}\r\n` +
        `OrigID: ${localId}\r\n` +
        `LocalAddr: IP=${localAddr} SSRC=0x00000000\r\n` +
        `RemoteAddr: IP=${remoteAddr} SSRC=0x00000000\r\n` +
        'LocalMetrics:\r\n' +
        'Timestamps: START=0 STOP=0\r\n' +
        'SessionDesc: PT=0 PD=opus SR=0 FD=0 FPP=0 PPS=0 PLC=0 SSUP=on\r\n' +
        `JitterBuffer: JBA=0 JBR=0 JBN=${JBN} JBM=${formatFloat(JBM)} JBX=0\r\n` +
        `PacketLoss: NLR=${NLR} JDR=${JDR}\r\n` +
        'BurstGapLoss: BLD=0 BD=0 GLD=0 GD=0 GMIN=0\r\n' +
        `Delay: RTD=${RTD} ESD=0 SOWD=0 IAJ=0\r\n` +
        `QualityEst: MOSLQ=${formatFloat(MOSLQ)} MOSCQ=${formatFloat(MOSCQ)}\r\n` +
        `DialogID: ${callID};to-tag=${toTag};from-tag=${fromTag}`);
};
const getQoSStatsTemplate = () => ({
    localAddr: '',
    remoteAddr: '',
    callID: '',
    localID: '',
    remoteID: '',
    origID: '',
    fromTag: '',
    toTag: '',
    timestamp: {
        start: '',
        stop: '',
    },
    netType: {},
    jitterBufferNominal: 0,
    jitterBufferMax: 0,
    jitterBufferDiscardRate: 0,
    totalSumJitter: 0,
    totalIntervalCount: 0,
    NLR: '',
    JBM: 0,
    JBN: '',
    JDR: '',
    MOSLQ: 0,
    MOSCQ: 0,
    RTD: 0,
    status: false,
    localcandidate: {},
    remotecandidate: {},
    inboundPacketsLost: 0,
    inboundPacketsReceived: 0,
    outboundPacketsLost: 0,
    outboundPacketsSent: 0,
});
const addToMap = (map = {}, key) => ({
    ...map,
    [key]: (key in map ? parseInt(map[key], 10) : 0) + 1,
});
const networkTypeMap = {
    bluetooth: 'Bluetooth',
    cellular: 'Cellulars',
    ethernet: 'Ethernet',
    wifi: 'WiFi',
    vpn: 'VPN',
    wimax: 'WiMax',
    '2g': '2G',
    '3g': '3G',
    '4g': '4G',
};
// TODO: find reliable way to find network type , use navigator.connection.type?
const getNetworkType = (connectionType) => {
    const sysNetwork = connectionType.systemNetworkType || 'unknown';
    const localNetwork = connectionType || 'unknown';
    const networkType = !sysNetwork || sysNetwork === 'unknown' ? localNetwork : sysNetwork;
    return networkType in networkTypeMap ? networkTypeMap[networkType] : networkType;
};
function calculateMos(packetLoss) {
    if (packetLoss <= 0.008) {
        return 4.5;
    }
    if (packetLoss > 0.45) {
        return 1.0;
    }
    const bpl = 17.2647;
    const r = 93.2062077233 - 95.0 * ((packetLoss * 100) / (packetLoss * 100 + bpl)) + 4;
    let mos = 2.06405 + 0.031738 * r - 0.000356641 * r * r + 2.93143 * Math.pow(10, -6) * r * r * r;
    if (mos < 1) {
        return 1.0;
    }
    if (mos > 4.5) {
        return 4.5;
    }
    if (packetLoss >= 0.35 && mos > 2.7) {
        mos = 2.7;
    }
    else if (packetLoss >= 0.3 && mos > 3.0) {
        mos = 3.0;
    }
    else if (packetLoss >= 0.2 && mos > 3.6) {
        mos = 3.6;
    }
    else if (packetLoss >= 0.15 && mos > 3.7) {
        mos = 3.7;
    }
    else if (packetLoss >= 0.1 && mos > 3.9) {
        mos = 4.1;
    }
    else if (packetLoss >= 0.05 && mos > 4.1) {
        mos = 4.3;
    }
    else if (packetLoss >= 0.03 && mos > 4.1) {
        mos = 4.4;
    }
    return mos;
}


/***/ }),

/***/ "./src/rtpReport.ts":
/*!**************************!*\
  !*** ./src/rtpReport.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isNoAudio: () => (/* binding */ isNoAudio)
/* harmony export */ });
function isNoAudio(report) {
    if (!report.inboundRtpReport) {
        return true;
    }
    if (!report.outboundRtpReport) {
        return true;
    }
    if (report.inboundRtpReport.packetsReceived === 0 || report.outboundRtpReport.packetsSent === 0) {
        return true;
    }
    return false;
}


/***/ }),

/***/ "./src/session.ts":
/*!************************!*\
  !*** ./src/session.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommonSession: () => (/* binding */ CommonSession),
/* harmony export */   onSessionDescriptionHandlerCreated: () => (/* binding */ onSessionDescriptionHandlerCreated),
/* harmony export */   patchIncomingWebphoneSession: () => (/* binding */ patchIncomingWebphoneSession),
/* harmony export */   patchWebphoneSession: () => (/* binding */ patchWebphoneSession)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sip.js */ "sip.js");
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sip_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sip_js_lib_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! sip.js/lib/core */ "./node_modules/sip.js/lib/core/messages/body.js");
/* harmony import */ var sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sip.js/lib/api/session-state */ "./node_modules/sip.js/lib/api/session-state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _mediaStreams__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mediaStreams */ "./src/mediaStreams.ts");
/* harmony import */ var _rtpReport__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rtpReport */ "./src/rtpReport.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./events */ "./src/events.ts");
/* harmony import */ var _qos__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./qos */ "./src/qos.ts");










class CommonSession {
    /** @ignore */
    __isRecording;
    /** @ignore */
    __localHold;
    /** @ignore */
    __patched;
    /** @ignore */
    __userAgentCoreEventsSetup;
    /** Flag to check if the call is on hold or not */
    held;
    /** Options to represent dom elements where media stream should be loaded */
    media;
    /** Flag to indicate if media stats are being collected */
    mediaStatsStarted;
    /** MediaStreams class instance which has the logic to collect media stream stats */
    mediaStreams;
    /** Flag to check if the call is muted or not */
    muted;
    /** Counter to represent how many media stats report were missed because of no audio */
    noAudioReportCount;
    /** JOSN representation of RC headers received for an incoming call */
    rcHeaders;
    __qosStats;
    /** Flag to represent if reinvite request was sent because there was no audio reported */
    reinviteForNoAudioSent;
    /** Time when session was started */
    startTime;
    /** @ignore */
    __accept;
    /** @ignore */
    __dispose;
    /** Method to attach event listener for session specific events */
    addListener;
    /** Add track to media source */
    addTrack;
    /** RingCentral barge implementation */
    barge;
    /** RingCentral blind transfer implementation */
    blindTransfer;
    /**
     * @internal
     * Helper function which represents if call control features can be used or not
     */
    canUseRCMCallControl;
    /**
     * @internal
     * Create session message which would be sent to the RingCentral backend
     */
    createSessionMessage;
    /** Sends a DTMF over the call */
    dtmf;
    /** Emit session specific events which will trigger all the event listeners attached */
    emit;
    /** RingCentral flip implementation */
    flip;
    /** RingCentral flip implementation */
    forward;
    /** Put the call on hold */
    hold;
    /** Ignore incoming call */
    ignore;
    /** Mute the call */
    mute;
    /** Remove event listener */
    off;
    /** Add event listener. Same as addListener */
    on;
    /** Add once event listener. Same as addListener */
    once;
    /** Returns if the call is on hold locally or not */
    onLocalHold;
    /** RingCentral park implementation */
    park;
    /** Send a session reinvite */
    reinvite;
    /** Remove event listener */
    removeListener;
    /** Remove all event listeners */
    removeAllListeners;
    /** RingCentral reply with message implementation */
    replyWithMessage;
    /**
     * @internal
     * Helper method that sends an INFO request to other user agent and then waits for an INFO request from the other user agent
     */
    sendInfoAndReceiveResponse;
    /**
     * @internal
     * Helper function to send INFO request with `move` instruction to RingCentral backend
     */
    sendMoveResponse;
    /** Send `receiveConfirm` command to backend */
    sendReceiveConfirm;
    /** Helper function to send session message to backend using UserAgent */
    sendSessionMessage;
    /** Start recording the call */
    startRecord;
    /** Function to stop collecting media stats */
    stopMediaStats;
    /** Stop recording the call */
    stopRecord;
    /** Send incoming call to voicemail */
    toVoicemail;
    /** Transfer current call */
    transfer;
    /** Put the call on unhold */
    unhold;
    /** Unmute the call */
    unmute;
    /** RingCentral warm transfer implementation */
    warmTransfer;
    /** RingCentral whisper implementation */
    whisper;
    setQosStats;
}
const mediaCheckTimer = 2000;
function patchWebphoneSession(session) {
    if (session.__patched) {
        return session;
    }
    session.__patched = true;
    session.held = false;
    session.muted = false;
    session.media = session.userAgent.media;
    session.__dispose = session.dispose.bind(session);
    session.dispose = dispose.bind(session);
    const eventEmitter = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    session.on = eventEmitter.on.bind(eventEmitter);
    session.off = eventEmitter.off.bind(eventEmitter);
    session.once = eventEmitter.once.bind(eventEmitter);
    session.addListener = eventEmitter.addListener.bind(eventEmitter);
    session.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    session.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
    session.emit = eventEmitter.emit.bind(eventEmitter);
    session.sendInfoAndReceiveResponse = sendInfoAndReceiveResponse.bind(session);
    session.startRecord = startRecord.bind(session);
    session.stopRecord = stopRecord.bind(session);
    session.sendMoveResponse = sendMoveResponse.bind(session);
    session.park = park.bind(session);
    session.flip = flip.bind(session);
    session.whisper = whisper.bind(session);
    session.barge = barge.bind(session);
    session.mute = mute.bind(session);
    session.unmute = unmute.bind(session);
    session.addTrack = addTrack.bind(session);
    session.stopMediaStats = stopMediaStats.bind(session);
    session.warmTransfer = warmTransfer.bind(session);
    session.blindTransfer = blindTransfer.bind(session);
    session.transfer = transfer.bind(session);
    session.hold = hold.bind(session);
    session.unhold = unhold.bind(session);
    session.dtmf = dtmf.bind(session);
    session.reinvite = reinvite.bind(session);
    session.forward = forward.bind(session); // FIXME: Not needed?
    session.__qosStats = {};
    session.setQosStats = setQosStats.bind(session);
    setupUserAgentCoreEvent(session);
    session.stateChange.addListener((newState) => {
        switch (newState) {
            case sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__.SessionState.Establishing: {
                session.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Establishing);
                break;
            }
            case sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__.SessionState.Established: {
                stopPlaying(session);
                session.addTrack();
                session.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Established);
                break;
            }
            case sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__.SessionState.Terminating: {
                stopPlaying(session);
                stopMediaStreamStats(session);
                session.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Terminating);
                break;
            }
            case sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__.SessionState.Terminated: {
                stopPlaying(session);
                session.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Terminated);
                break;
            }
        }
    });
    // FIXME: Do we need this? The replaced session is part of existing sessions and would have already been patched
    // NEEDED - inviter.ts L191
    // session.on("replaced", patchWebphoneSession);
    if (session.userAgent.onSession) {
        session.userAgent.onSession(session);
    }
    session.mediaStatsStarted = false;
    session.noAudioReportCount = 0;
    session.reinviteForNoAudioSent = false;
    return session;
}
function patchIncomingWebphoneSession(session) {
    try {
        parseRcHeader(session);
    }
    catch (e) {
        session.logger.error("Can't parse RC headers from invite request due to " + e);
    }
    session.canUseRCMCallControl = canUseRCMCallControl.bind(session);
    session.createSessionMessage = createSessionMessage.bind(session);
    session.ignore = ignore.bind(session);
    session.replyWithMessage = replyWithMessage.bind(session);
    session.sendReceiveConfirm = sendReceiveConfirm.bind(session);
    session.sendSessionMessage = sendSessionMessage.bind(session);
    session.toVoicemail = toVoicemail.bind(session);
    session.__accept = session.accept.bind(session);
    session.accept = accept.bind(session);
    setupUserAgentCoreEvent(session);
}
function canUseRCMCallControl() {
    return !!this.rcHeaders;
}
function createSessionMessage(options) {
    if (!this.rcHeaders) {
        throw Error('createSessionMessage options is undefined');
    }
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.extend)(options, {
        sid: this.rcHeaders.sid,
        request: this.rcHeaders.request,
        from: this.rcHeaders.to,
        to: this.rcHeaders.from,
    });
    return this.userAgent.createRcMessage(options);
}
async function sendReceiveConfirm() {
    return this.sendSessionMessage(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.receiveConfirm)
        .then((response) => {
        this.logger.log('sendReceiveConfirm success');
        return response;
    })
        .catch((error) => this.logger.error(`failed to send receive confirmation via SIP MESSAGE due to ${error.message}`));
}
function sendSessionMessage(options) {
    if (!this.rcHeaders) {
        this.logger.error("Can't send SIP MESSAGE related to session: no RC headers available");
    }
    return this.userAgent.sendMessage(this.rcHeaders.from, this.createSessionMessage(options));
}
async function sendInfoAndReceiveResponse(command, _options) {
    const options = _options || {};
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.extend)(command, options);
    delete command.extraHeaders;
    return new Promise((resolve, reject) => {
        const requestDelegate = {
            onAccept: (response) => {
                let timeout;
                const { message: { statusCode, callId }, } = response;
                if (statusCode === 200) {
                    const onInfo = (message) => {
                        // FIXME: I think we need this check here
                        if (message.callId !== callId) {
                            return;
                        }
                        const body = message?.body || '{}';
                        let obj;
                        try {
                            obj = JSON.parse(body);
                        }
                        catch (e) {
                            obj = {};
                        }
                        if (obj.response && obj.response.command === command.command && obj.response.result) {
                            timeout && clearTimeout(timeout);
                            this.off('RC_SIP_INFO', onInfo);
                            if (obj.response.result.code.toString() === '0') {
                                return resolve(obj.response.result);
                            }
                            return reject(obj.response.result);
                        }
                    };
                    timeout = setTimeout(() => {
                        reject(new Error('Timeout: no reply'));
                        this.off('RC_SIP_INFO', onInfo);
                    }, _constants__WEBPACK_IMPORTED_MODULE_3__.responseTimeout);
                    this.on('RC_SIP_INFO', onInfo);
                }
                else {
                    reject(new Error(`The INFO response status code is: ${statusCode} (waiting for 200)`));
                }
            },
            onReject: (response) => {
                reject(new Error(`The INFO response status code is: ${response.message.statusCode} (waiting for 200)`));
            },
        };
        const requestOptions = {
            extraHeaders: [...(options.extraHeaders || []), ...this.userAgent.defaultHeaders],
            body: (0,sip_js_lib_core__WEBPACK_IMPORTED_MODULE_9__.fromBodyLegacy)({
                body: JSON.stringify({ request: command }),
                contentType: 'application/json;charset=utf-8',
            }),
        };
        this.info({ requestDelegate, requestOptions });
    });
}
async function startRecord() {
    return setRecord(this, true);
}
async function stopRecord() {
    return setRecord(this, false);
}
// eslint-disable-next-line max-params
function sendMoveResponse(reqId, code, description, options = {}) {
    const extraHeaders = options.extraHeaders || [];
    const requestOptions = {
        extraHeaders: [...extraHeaders, ...this.userAgent.defaultHeaders],
        body: (0,sip_js_lib_core__WEBPACK_IMPORTED_MODULE_9__.fromBodyLegacy)({
            body: JSON.stringify({
                response: {
                    reqId,
                    command: 'move',
                    result: {
                        code,
                        description,
                    },
                },
            }),
            contentType: 'application/json;charset=utf-8',
        }),
    };
    this.info({ requestOptions });
}
function ignore() {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.ignore));
}
function toVoicemail() {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.toVoicemail));
}
function replyWithMessage(replyOptions) {
    let body = 'RepTp="' + replyOptions.replyType + '"';
    if (replyOptions.replyType === 0) {
        body += ' Bdy="' + replyOptions.replyText + '"';
    }
    else if (replyOptions.replyType === 1 || replyOptions.replyType === 4) {
        body += ' Vl="' + replyOptions.timeValue + '"';
        body += ' Units="' + replyOptions.timeUnits + '"';
        body += ' Dir="' + replyOptions.callbackDirection + '"';
    }
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage({ reqid: _constants__WEBPACK_IMPORTED_MODULE_3__.messages.replyWithMessage.reqid, body }));
}
async function flip(target) {
    return this.sendInfoAndReceiveResponse(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.flip, { target });
}
async function whisper() {
    return this.sendInfoAndReceiveResponse(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.whisper);
}
async function barge() {
    return this.sendInfoAndReceiveResponse(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.barge);
}
function park() {
    return this.sendInfoAndReceiveResponse(_constants__WEBPACK_IMPORTED_MODULE_3__.messages.park);
}
function mute(silent) {
    if (this.state !== sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__.SessionState.Established) {
        this.logger.warn('An active session is required to mute audio');
        return;
    }
    if (this.muted) {
        this.logger.debug('Session already muted');
        return;
    }
    this.logger.log('Muting Audio');
    enableSenderTracks(this, false);
    this.muted = true;
    if (!silent) {
        this.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Muted, this);
    }
}
function unmute(silent) {
    if (this.state !== sip_js_lib_api_session_state__WEBPACK_IMPORTED_MODULE_8__.SessionState.Established) {
        this.logger.warn('An active session is required to unmute audio');
        return;
    }
    if (!this.muted) {
        this.logger.debug('Session not muted');
        return;
    }
    this.logger.log('Unmuting Audio');
    enableSenderTracks(this, true);
    this.muted = false;
    if (!silent) {
        this.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Unmuted, this);
    }
}
function addTrack(remoteAudioEle, localAudioEle) {
    const sessionDescriptionHandler = this.sessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    let remoteAudio;
    let localAudio;
    if (remoteAudioEle && localAudioEle) {
        remoteAudio = remoteAudioEle;
        localAudio = localAudioEle;
    }
    else if (this.media) {
        remoteAudio = this.media.remote;
        localAudio = this.media.local;
    }
    else {
        throw new Error('HTML Media Element not Defined');
    }
    // TODO: peerConnecton.remoteMediaStream already has reciver track added thanks to default session description handler. Can we remove this code?
    let remoteStream = new MediaStream();
    if (peerConnection?.getReceivers) {
        peerConnection.getReceivers().forEach((receiver) => {
            const rtrack = receiver.track;
            if (rtrack) {
                remoteStream.addTrack(rtrack);
                this.logger.log('Remote track added');
            }
        });
    }
    else {
        remoteStream = sessionDescriptionHandler.remoteMediaStream;
        this.logger.log('Remote track added');
    }
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play().catch(() => {
        this.logger.error('Remote play was rejected');
    });
    // TODO: peerConnecton.localMediaStream already has sender track added thanks to default session description handler. Can we remove this code?
    let localStream = new MediaStream();
    if (peerConnection?.getSenders) {
        peerConnection.getSenders().forEach((sender) => {
            const strack = sender.track;
            if (strack && strack.kind === 'audio') {
                localStream.addTrack(strack);
                this.logger.log('Local track added');
            }
        });
    }
    else {
        localStream = sessionDescriptionHandler.localMediaStream;
        this.logger.log('Local track added');
    }
    localAudio.srcObject = localStream;
    localAudio.play().catch(() => {
        this.logger.error('Local play was rejected');
    });
    if (localStream && remoteStream && !this.mediaStatsStarted) {
        this.mediaStreams = new _mediaStreams__WEBPACK_IMPORTED_MODULE_4__.MediaStreams(this);
        this.logger.log('Start gathering media report');
        this.mediaStatsStarted = true;
        this.mediaStreams.getMediaStats((report) => {
            if (this.userAgent.enableMediaReportLogging) {
                this.logger.log(`Got media report: ${JSON.stringify(report)}`);
            }
            if (!this.reinviteForNoAudioSent && (0,_rtpReport__WEBPACK_IMPORTED_MODULE_5__.isNoAudio)(report)) {
                this.logger.log('No audio report');
                this.noAudioReportCount++;
                if (this.noAudioReportCount === 3) {
                    this.logger.log('No audio for 6 sec. Trying to recover audio by sending Re-invite');
                    this.mediaStreams.reconnectMedia();
                    this.reinviteForNoAudioSent = true;
                    this.noAudioReportCount = 0;
                }
            }
            else if (!(0,_rtpReport__WEBPACK_IMPORTED_MODULE_5__.isNoAudio)(report)) {
                this.noAudioReportCount = 0;
            }
        }, mediaCheckTimer);
    }
}
function stopMediaStats() {
    this.logger.log('Stopping media stats collection');
    if (!this) {
        return;
    }
    this.mediaStreams?.stopMediaStats();
    this.mediaStatsStarted = false;
    this.noAudioReportCount = 0;
}
async function blindTransfer(target, options = {}) {
    this.logger.log('Call transfer initiated');
    const newTarget = typeof target === 'string' ? sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo.domain}`) : target;
    return this.refer(newTarget, options);
}
async function warmTransfer(target, options = { requestOptions: { extraHeaders: [] } }) {
    options.requestOptions.extraHeaders = (options.requestOptions.extraHeaders || []).concat(this.userAgent.defaultHeaders);
    const newTarget = typeof target === 'string' ? sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo.domain}`) : target;
    this.logger.log('Completing warm transfer');
    return this.refer(newTarget, options);
}
async function transfer(target, options = { requestOptions: { extraHeaders: [] } }) {
    options.requestOptions.extraHeaders = (options.requestOptions.extraHeaders || []).concat(this.userAgent.defaultHeaders);
    return this.blindTransfer(target, options);
}
/**
 *
 * @param this WebPhoneSessionSessionInviteOptions
 * @param options
 * @returns Promise<OutgoingInviteRequest>
 *
 * Sends a reinvite. Also makes sure to regenerate a new SDP by passing offerToReceiveAudio: true, offerToReceiveVideo: false  and iceRestart: true
 * Once the SDP is ready, the local description is set and the SDP is sent to the remote peer along with an INVITE request
 */
function reinvite(options = {}) {
    options.sessionDescriptionHandlerOptions = {
        ...options.sessionDescriptionHandlerOptions,
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
        iceRestart: true,
    };
    options.requestDelegate = options.requestDelegate || {};
    const originalOnAccept = options.requestDelegate.onAccept?.bind(options.requestDelegate);
    options.requestDelegate.onAccept = (...args) => {
        patchIncomingWebphoneSession(this);
        originalOnAccept?.(...args);
    };
    return this.invite(options);
}
async function hold() {
    this.stopMediaStats();
    try {
        this.logger.log('Hold Initiated');
        await setHold(this, true);
        this.logger.log('Hold completed, held is set to true');
    }
    catch (e) {
        throw new Error('Hold could not be completed');
    }
}
async function unhold() {
    try {
        this.logger.log('Unhold Initiated');
        await setHold(this, false);
        this.logger.log('Unhold completed, held is set to false');
    }
    catch (e) {
        throw new Error('Unhold could not be completed');
    }
}
// eslint-disable-next-line max-params
function dtmf(dtmf, _duration = 100, _interToneGap = 50) {
    const duration = parseInt(_duration.toString(), 10);
    const interToneGap = parseInt(_interToneGap.toString(), 10);
    const sessionDescriptionHandler = this.sessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
        this.logger.error('Peer connection closed.');
        return;
    }
    const senders = peerConnection.getSenders();
    const audioSender = senders.find((sender) => sender.track && sender.track.kind === 'audio');
    const dtmfSender = audioSender.dtmf;
    if (dtmfSender !== undefined && dtmfSender) {
        this.logger.log(`Send DTMF: ${dtmf} Duration: ${duration} InterToneGap: ${interToneGap}`);
        return dtmfSender.insertDTMF(dtmf, duration, interToneGap);
    }
    throw new Error('Send DTMF failed');
}
async function accept(_options = {}) {
    const options = _options || {};
    options.extraHeaders = (options.extraHeaders || []).concat(this.userAgent.defaultHeaders);
    options.sessionDescriptionHandlerOptions = {
        ...options.sessionDescriptionHandlerOptions,
    };
    options.sessionDescriptionHandlerOptions.constraints = options.sessionDescriptionHandlerOptions.constraints || {
        ...this.userAgent.constraints,
        optional: [{ DtlsSrtpKeyAgreement: 'true' }],
    };
    try {
        await this.__accept(options);
        this.startTime = new Date();
        this.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.Accepted, this.request);
    }
    catch (e) {
        if (e.message.indexOf('Permission denied') !== -1) {
            this.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.UserMediaFailed);
        }
    }
}
// eslint-disable-next-line max-params
async function forward(target, acceptOptions, transferOptions) {
    await this.accept(acceptOptions);
    return new Promise((resolve) => {
        this.mute();
        setTimeout(() => {
            resolve(this.transfer(target, transferOptions));
        }, 700);
    });
}
async function dispose() {
    stopMediaStreamStats(this);
    this.__dispose();
}
/* ---------------------------------------------------------- HELPER FUNCTIONS ---------------------------------------------------------- */
function parseRcHeaderString(str = '') {
    const pairs = str.split(/; */).filter((pair) => pair.includes('=')); // skip things that don't look like key=value
    const result = {};
    for (const pair of pairs) {
        let [key, value] = pair.split('=');
        key = key.trim();
        value = value.trim();
        if (!(key in result)) {
            result[key] = value;
        }
    }
    return result;
}
function parseRcHeader(session) {
    const prc = session.request.getHeader('P-Rc');
    const prcCallInfo = session.request.getHeader('P-Rc-Api-Call-Info');
    if (prc) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(prc, 'text/xml');
        const hdrNode = xmlDoc.getElementsByTagName('Hdr')[0];
        const bdyNode = xmlDoc.getElementsByTagName('Bdy')[0];
        if (hdrNode) {
            session.rcHeaders = {
                sid: hdrNode.getAttribute('SID') || undefined,
                request: hdrNode.getAttribute('Req') || undefined,
                from: hdrNode.getAttribute('From') || undefined,
                to: hdrNode.getAttribute('To') || undefined,
            };
        }
        if (bdyNode) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__.extend)(session.rcHeaders, {
                srvLvl: bdyNode.getAttribute('SrvLvl'),
                srvLvlExt: bdyNode.getAttribute('SrvLvlExt'),
                nm: bdyNode.getAttribute('Nm'),
                toNm: bdyNode.getAttribute('ToNm'),
            });
        }
    }
    if (prcCallInfo) {
        const parsed = parseRcHeaderString(prcCallInfo);
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.extend)(session.rcHeaders, parsed);
    }
}
async function setRecord(session, flag) {
    const message = flag ? _constants__WEBPACK_IMPORTED_MODULE_3__.messages.startRecord : _constants__WEBPACK_IMPORTED_MODULE_3__.messages.stopRecord;
    if ((session.__isRecording && !flag) || (!session.__isRecording && flag)) {
        const data = await session.sendInfoAndReceiveResponse(message);
        session.__isRecording = !!flag;
        return data;
    }
}
function enableReceiverTracks(session, enable) {
    const sessionDescriptionHandler = session.sessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
        session.logger.error('Peer connection closed.');
        return;
    }
    peerConnection.getReceivers().forEach((receiver) => {
        if (receiver.track) {
            receiver.track.enabled = enable;
        }
    });
}
function enableSenderTracks(session, enable) {
    const sessionDescriptionHandler = session.sessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
        session.logger.error('Peer connection closed.');
        return;
    }
    peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
            sender.track.enabled = enable;
        }
    });
}
function setHold(session, hold) {
    return new Promise((resolve, reject) => {
        // Just resolve if we are already in correct state
        if (session.held === hold) {
            resolve();
            return;
        }
        const options = {
            requestDelegate: {
                onAccept: async (response) => {
                    session.held = hold;
                    const sessionDescriptionHandler = session.sessionDescriptionHandler;
                    const peerConnection = sessionDescriptionHandler.peerConnection;
                    const localSdp = peerConnection.localDescription.sdp;
                    const match = localSdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);
                    const direction = match ? match[1] : '';
                    session.__localHold = response.message.statusCode === 200 && direction === 'sendonly';
                    session.logger.log('localhold is set to ' + session.__localHold);
                    enableReceiverTracks(session, !session.held);
                    enableSenderTracks(session, !session.held && !session.muted);
                    resolve();
                },
                onReject: () => {
                    session.logger.warn('re-invite request was rejected');
                    enableReceiverTracks(session, !session.held);
                    enableSenderTracks(session, !session.held && !session.muted);
                    reject(new Error('re-invite request was rejected'));
                },
            },
        };
        // Session properties used to pass options to the SessionDescriptionHandler:
        //
        // 1) Session.sessionDescriptionHandlerOptions
        //    SDH options for the initial INVITE transaction.
        //    - Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
        //    - May be set directly at anytime.
        //    - May optionally be set via constructor option.
        //    - May optionally be set via options passed to Inviter.invite() or Invitation.accept().
        //
        // 2) Session.sessionDescriptionHandlerOptionsReInvite
        //    SDH options for re-INVITE transactions.
        //    - Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
        //    - May be set directly at anytime.
        //    - May optionally be set via constructor option.
        //    - May optionally be set via options passed to Session.invite().
        const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
        sessionDescriptionHandlerOptions.hold = hold;
        session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;
        // Send re-INVITE
        session
            .invite(options)
            .then(() => {
            // preemptively enable/disable tracks
            enableReceiverTracks(session, !hold);
            enableSenderTracks(session, !hold && !session.muted);
        })
            .catch((error) => {
            if (error instanceof sip_js__WEBPACK_IMPORTED_MODULE_1__.RequestPendingError) {
                session.logger.error('A hold request is already in progress.');
            }
            reject(error);
        });
    });
}
function stopPlaying(session) {
    session.userAgent.audioHelper.playOutgoing(false);
    session.userAgent.audioHelper.playIncoming(false);
}
function onSessionDescriptionHandlerCreated(session) {
    if (!session.userAgent.enableQos) {
        return;
    }
    session.logger.log('SessionDescriptionHandler created');
    (0,_qos__WEBPACK_IMPORTED_MODULE_7__.startQosStatsCollection)(session);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => session.logger.log(`${device.kind} = ${device.label} ${JSON.stringify(device)}`));
    });
}
function setupUserAgentCoreEvent(session) {
    if (session.__userAgentCoreEventsSetup) {
        return;
    }
    const userAgentCore = session.userAgent.userAgentCore;
    userAgentCore.on(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.UpdateReceived, (payload) => session.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.UpdateReceived, payload));
    userAgentCore.on(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.MoveToRcv, (payload) => session.emit(_events__WEBPACK_IMPORTED_MODULE_6__.Events.Session.MoveToRcv, payload));
    // RC_SIP_INFO event is for internal use
    userAgentCore.on('RC_SIP_INFO', (payload) => session.emit('RC_SIP_INFO', payload));
    session.__userAgentCoreEventsSetup = true;
}
function stopMediaStreamStats(session) {
    if (session.mediaStreams) {
        session.logger.log('Releasing media streams');
        session.mediaStreams.release();
    }
}
function onLocalHold() {
    return this.__localHold;
}
function setQosStats(stats) {
    this.__qosStats.cpuOS = stats.cpuOS || '0:0:0';
    this.__qosStats.cpuRC = stats.cpuRC || '0:0:0';
    this.__qosStats.ram = stats.ram || '0:0:0';
    this.__qosStats.netType = stats.netType || undefined;
}


/***/ }),

/***/ "./src/sessionDescriptionHandler.ts":
/*!******************************************!*\
  !*** ./src/sessionDescriptionHandler.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SessionDescriptionHandler: () => (/* binding */ SessionDescriptionHandler),
/* harmony export */   defaultMediaStreamFactory: () => (/* binding */ defaultMediaStreamFactory),
/* harmony export */   defaultPeerConnectionConfiguration: () => (/* binding */ defaultPeerConnectionConfiguration),
/* harmony export */   defaultSessionDescriptionFactory: () => (/* binding */ defaultSessionDescriptionFactory)
/* harmony export */ });
/**
 * A base class implementing a WebRTC session description handler for sip.js.
 * @remarks
 * It is expected/intended to be extended by specific WebRTC based applications.
 * @privateRemarks
 * So do not put application specific implementation in here.
 * @public
 */
class SessionDescriptionHandler {
    // The addtrack event does not get fired when JavaScript code explicitly adds tracks to the stream (by calling addTrack()).
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
    static dispatchAddTrackEvent(stream, track) {
        stream.dispatchEvent(new MediaStreamTrackEvent('addtrack', { track }));
    }
    // The removetrack event does not get fired when JavaScript code explicitly removes tracks from the stream (by calling removeTrack()).
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onremovetrack
    static dispatchRemoveTrackEvent(stream, track) {
        stream.dispatchEvent(new MediaStreamTrackEvent('removetrack', { track }));
    }
    /** Logger. */
    logger;
    /** Media stream factory. */
    mediaStreamFactory;
    /** Configuration options. */
    sessionDescriptionHandlerConfiguration;
    /** The local media stream. */
    _localMediaStream;
    /** The remote media stream. */
    _remoteMediaStream;
    /** The data channel. Undefined before created. */
    _dataChannel;
    /** The peer connection. Undefined after SessionDescriptionHandler.close(). */
    _peerConnection;
    /** The peer connection delegate. */
    _peerConnectionDelegate;
    iceGatheringCompletePromise;
    iceGatheringCompleteTimeoutId;
    iceGatheringCompleteResolve;
    iceGatheringCompleteReject;
    localMediaStreamConstraints;
    onDataChannel;
    /**
     * Constructor
     * @param logger - A logger
     * @param mediaStreamFactory - A factory to provide a MediaStream
     * @param options - Options passed from the SessionDescriptionHandleFactory
     */
    constructor(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration) {
        logger.debug('SessionDescriptionHandler.constructor');
        this.logger = logger;
        this.mediaStreamFactory = mediaStreamFactory;
        this.sessionDescriptionHandlerConfiguration = sessionDescriptionHandlerConfiguration;
        this._localMediaStream = new MediaStream();
        this._remoteMediaStream = new MediaStream();
        this._peerConnection = new RTCPeerConnection(sessionDescriptionHandlerConfiguration?.peerConnectionConfiguration);
        this.initPeerConnectionEventHandlers();
    }
    /**
     * The local media stream currently being sent.
     *
     * @remarks
     * The local media stream initially has no tracks, so the presence of tracks
     * should not be assumed. Furthermore, tracks may be added or removed if the
     * local media changes - for example, on upgrade from audio only to a video session.
     * At any given time there will be at most one audio track and one video track
     * (it's possible that this restriction may not apply to sub-classes).
     * Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
     * to detect when a new track becomes available:
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
     */
    get localMediaStream() {
        return this._localMediaStream;
    }
    /**
     * The remote media stream currently being received.
     *
     * @remarks
     * The remote media stream initially has no tracks, so the presence of tracks
     * should not be assumed. Furthermore, tracks may be added or removed if the
     * remote media changes - for example, on upgrade from audio only to a video session.
     * At any given time there will be at most one audio track and one video track
     * (it's possible that this restriction may not apply to sub-classes).
     * Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
     * to detect when a new track becomes available:
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
     */
    get remoteMediaStream() {
        return this._remoteMediaStream;
    }
    /**
     * The data channel. Undefined before it is created.
     */
    get dataChannel() {
        return this._dataChannel;
    }
    /**
     * The peer connection. Undefined if peer connection has closed.
     *
     * @remarks
     * While access to the underlying `RTCPeerConnection` is provided, note that
     * using methods with modify it may break the operation of this class.
     * In particular, this class depends on exclusive access to the
     * event handler properties. If you need access to the peer connection
     * events, either register for events using `addEventListener()` on
     * the `RTCPeerConnection` or set the `peerConnectionDelegate` on
     * this `SessionDescriptionHandler`.
     */
    get peerConnection() {
        return this._peerConnection;
    }
    /**
     * A delegate which provides access to the peer connection event handlers.
     *
     * @remarks
     * Setting the peer connection event handlers directly is not supported
     * and may break this class. As this class depends on exclusive access
     * to them, a delegate may be set which provides alternative access to
     * the event handlers in a fashion which is supported.
     */
    get peerConnectionDelegate() {
        return this._peerConnectionDelegate;
    }
    set peerConnectionDelegate(delegate) {
        this._peerConnectionDelegate = delegate;
    }
    /**
     * Stop tracks and close peer connection.
     */
    close() {
        this.logger.debug('SessionDescriptionHandler.close');
        if (this._peerConnection === undefined) {
            return;
        }
        this._peerConnection.getReceivers().forEach((receiver) => {
            receiver.track?.stop();
        });
        this._peerConnection.getSenders().forEach((sender) => {
            sender.track?.stop();
        });
        if (this._dataChannel) {
            this._dataChannel.close();
        }
        this._peerConnection.close();
        this._peerConnection = undefined;
    }
    /**
     * Creates an offer or answer.
     * @param options - Options bucket.
     * @param modifiers - Modifiers.
     */
    getDescription(options, modifiers) {
        this.logger.debug('SessionDescriptionHandler.getDescription');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        // Callback on data channel creation
        this.onDataChannel = options?.onDataChannel;
        // ICE will restart upon applying an offer created with the iceRestart option
        const iceRestart = options?.offerOptions?.iceRestart;
        // ICE gathering timeout may be set on a per call basis, otherwise the configured default is used
        const iceTimeout = options?.iceGatheringTimeout === undefined
            ? this.sessionDescriptionHandlerConfiguration?.iceGatheringTimeout
            : options?.iceGatheringTimeout;
        return this.getLocalMediaStream(options)
            .then(() => this.enableSenderDscp())
            .then(() => this.updateDirection(options))
            .then(() => this.createDataChannel(options))
            .then(() => this.createLocalOfferOrAnswer(options))
            .then((sessionDescription) => this.applyModifiers(sessionDescription, modifiers))
            .then((sessionDescription) => this.setLocalSessionDescription(sessionDescription))
            .then(() => this.waitForIceGatheringComplete(iceRestart, iceTimeout))
            .then(() => this.getLocalSessionDescription())
            .then((sessionDescription) => {
            return {
                body: sessionDescription.sdp,
                contentType: 'application/sdp',
            };
        })
            .catch((error) => {
            this.logger.error('SessionDescriptionHandler.getDescription failed - ' + error);
            throw error;
        });
    }
    /**
     * Returns true if the SessionDescriptionHandler can handle the Content-Type described by a SIP message.
     * @param contentType - The content type that is in the SIP Message.
     */
    hasDescription(contentType) {
        this.logger.debug('SessionDescriptionHandler.hasDescription');
        return contentType === 'application/sdp';
    }
    /**
     * Send DTMF via RTP (RFC 4733).
     * Returns true if DTMF send is successful, false otherwise.
     * @param tones - A string containing DTMF digits.
     * @param options - Options object to be used by sendDtmf.
     */
    sendDtmf(tones, options) {
        this.logger.debug('SessionDescriptionHandler.sendDtmf');
        if (this._peerConnection === undefined) {
            this.logger.error('SessionDescriptionHandler.sendDtmf failed - peer connection closed');
            return false;
        }
        const senders = this._peerConnection.getSenders();
        if (senders.length === 0) {
            this.logger.error('SessionDescriptionHandler.sendDtmf failed - no senders');
            return false;
        }
        const dtmfSender = senders[0].dtmf;
        if (!dtmfSender) {
            this.logger.error('SessionDescriptionHandler.sendDtmf failed - no DTMF sender');
            return false;
        }
        const duration = options?.duration;
        const interToneGap = options?.interToneGap;
        try {
            dtmfSender.insertDTMF(tones, duration, interToneGap);
        }
        catch (e) {
            this.logger.error(e);
            return false;
        }
        this.logger.log('SessionDescriptionHandler.sendDtmf sent via RTP: ' + tones.toString());
        return true;
    }
    /**
     * Sets an offer or answer.
     * @param sdp - The session description.
     * @param options - Options bucket.
     * @param modifiers - Modifiers.
     */
    setDescription(sdp, options, modifiers) {
        this.logger.debug('SessionDescriptionHandler.setDescription');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        // Callback on data channel creation
        this.onDataChannel = options?.onDataChannel;
        // SDP type
        const type = this._peerConnection.signalingState === 'have-local-offer' ? 'answer' : 'offer';
        return this.getLocalMediaStream(options)
            .then(() => this.applyModifiers({ sdp, type }, modifiers))
            .then((sessionDescription) => this.setRemoteSessionDescription(sessionDescription))
            .catch((error) => {
            this.logger.error('SessionDescriptionHandler.setDescription failed - ' + error);
            throw error;
        });
    }
    /**
     * Applies modifiers to SDP prior to setting the local or remote description.
     * @param sdp - SDP to modify.
     * @param modifiers - Modifiers to apply.
     */
    applyModifiers(sdp, modifiers) {
        this.logger.debug('SessionDescriptionHandler.applyModifiers');
        if (!modifiers || modifiers.length === 0) {
            return Promise.resolve(sdp);
        }
        return modifiers
            .reduce((cur, next) => cur.then(next), Promise.resolve(sdp))
            .then((modified) => {
            this.logger.debug('SessionDescriptionHandler.applyModifiers - modified sdp');
            if (!modified.sdp || !modified.type) {
                throw new Error('Invalid SDP.');
            }
            return { sdp: modified.sdp, type: modified.type };
        });
    }
    /**
     * Create a data channel.
     * @remarks
     * Only creates a data channel if SessionDescriptionHandlerOptions.dataChannel is true.
     * Only creates a data channel if creating a local offer.
     * Only if one does not already exist.
     * @param options - Session description handler options.
     */
    createDataChannel(options) {
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        // only create a data channel if requested
        if (options?.dataChannel !== true) {
            return Promise.resolve();
        }
        // do not create a data channel if we already have one
        if (this._dataChannel) {
            return Promise.resolve();
        }
        switch (this._peerConnection.signalingState) {
            case 'stable':
                // if we are stable, assume we are creating a local offer so create a data channel
                this.logger.debug('SessionDescriptionHandler.createDataChannel - creating data channel');
                try {
                    this._dataChannel = this._peerConnection.createDataChannel(options?.dataChannelLabel || '', options?.dataChannelOptions);
                    if (this.onDataChannel) {
                        this.onDataChannel(this._dataChannel);
                    }
                    return Promise.resolve();
                }
                catch (error) {
                    return Promise.reject(error);
                }
            case 'have-remote-offer':
                return Promise.resolve();
            case 'have-local-offer':
            case 'have-local-pranswer':
            case 'have-remote-pranswer':
            case 'closed':
            default:
                return Promise.reject(new Error('Invalid signaling state ' + this._peerConnection.signalingState));
        }
    }
    /**
     * Depending on current signaling state, create a local offer or answer.
     * @param options - Session description handler options.
     */
    createLocalOfferOrAnswer(options) {
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        switch (this._peerConnection.signalingState) {
            case 'stable':
                // if we are stable, assume we are creating a local offer
                this.logger.debug('SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP offer');
                return this._peerConnection.createOffer(options?.offerOptions);
            case 'have-remote-offer':
                // if we have a remote offer, assume we are creating a local answer
                this.logger.debug('SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP answer');
                return this._peerConnection.createAnswer(options?.answerOptions);
            case 'have-local-offer':
            case 'have-local-pranswer':
            case 'have-remote-pranswer':
            case 'closed':
            default:
                return Promise.reject(new Error('Invalid signaling state ' + this._peerConnection.signalingState));
        }
    }
    /**
     * Get a media stream from the media stream factory and set the local media stream.
     * @param options - Session description handler options.
     */
    getLocalMediaStream(options) {
        this.logger.debug('SessionDescriptionHandler.getLocalMediaStream');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        let constraints = { ...options?.constraints };
        // if we already have a local media stream...
        if (this.localMediaStreamConstraints) {
            // ignore constraint "downgrades"
            constraints.audio = constraints.audio || this.localMediaStreamConstraints.audio;
            constraints.video = constraints.video || this.localMediaStreamConstraints.video;
            // if constraints have not changed, do not get a new media stream
            if (JSON.stringify(this.localMediaStreamConstraints.audio) === JSON.stringify(constraints.audio) &&
                JSON.stringify(this.localMediaStreamConstraints.video) === JSON.stringify(constraints.video)) {
                return Promise.resolve();
            }
        }
        else {
            // if no constraints have been specified, default to audio for initial media stream
            if (constraints.audio === undefined && constraints.video === undefined) {
                constraints = { audio: true };
            }
        }
        this.localMediaStreamConstraints = constraints;
        return this.mediaStreamFactory(constraints, this).then((mediaStream) => this.setLocalMediaStream(mediaStream));
    }
    /**
     * Sets the encoding priorty to high for sender track.
     *
     */
    async enableSenderDscp() {
        if (!this.sessionDescriptionHandlerConfiguration?.enableDscp) {
            return;
        }
        if (!this._peerConnection) {
            throw new Error('Peer connection undefined.');
        }
        for (const sender of this._peerConnection.getSenders().filter((sender) => sender.track)) {
            const parameters = sender.getParameters();
            console.info('getsender params =', parameters);
            parameters.priority = 'high';
            try {
                await sender.setParameters(parameters);
            }
            catch (error) {
                console.error(`Error while setting encodings parameters for ${sender.track.kind} Track ${sender.track.id}: ${error.message || error.name}`);
            }
        }
    }
    /**
     * Sets the peer connection's sender tracks and local media stream tracks.
     *
     * @remarks
     * Only the first audio and video tracks of the provided MediaStream are utilized.
     * Adds tracks if audio and/or video tracks are not already present, otherwise replaces tracks.
     *
     * @param stream - Media stream containing tracks to be utilized.
     */
    setLocalMediaStream(stream) {
        this.logger.debug('SessionDescriptionHandler.setLocalMediaStream');
        if (!this._peerConnection) {
            throw new Error('Peer connection undefined.');
        }
        const pc = this._peerConnection;
        const localStream = this._localMediaStream;
        const trackUpdates = [];
        const updateTrack = (newTrack) => {
            const kind = newTrack.kind;
            if (kind !== 'audio' && kind !== 'video') {
                throw new Error(`Unknown new track kind ${kind}.`);
            }
            const sender = pc.getSenders().find((sender) => sender.track && sender.track.kind === kind);
            if (sender) {
                trackUpdates.push(new Promise((resolve) => {
                    this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - replacing sender ${kind} track`);
                    resolve();
                }).then(() => sender
                    .replaceTrack(newTrack)
                    .then(() => {
                    const oldTrack = localStream.getTracks().find((localTrack) => localTrack.kind === kind);
                    if (oldTrack) {
                        oldTrack.stop();
                        localStream.removeTrack(oldTrack);
                        SessionDescriptionHandler.dispatchRemoveTrackEvent(localStream, oldTrack);
                    }
                    localStream.addTrack(newTrack);
                    SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
                })
                    .catch((error) => {
                    this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to replace sender ${kind} track`);
                    throw error;
                })));
            }
            else {
                trackUpdates.push(new Promise((resolve) => {
                    this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${kind} track`);
                    resolve();
                }).then(() => {
                    // Review: could make streamless tracks a configurable option?
                    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack#Usage_notes
                    try {
                        pc.addTrack(newTrack, localStream);
                    }
                    catch (error) {
                        this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${kind} track`);
                        throw error;
                    }
                    localStream.addTrack(newTrack);
                    SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
                }));
            }
        };
        // update peer connection audio tracks
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length) {
            updateTrack(audioTracks[0]);
        }
        // update peer connection video tracks
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length) {
            updateTrack(videoTracks[0]);
        }
        return trackUpdates.reduce((p, x) => p.then(() => x), Promise.resolve());
    }
    /**
     * Gets the peer connection's local session description.
     */
    getLocalSessionDescription() {
        this.logger.debug('SessionDescriptionHandler.getLocalSessionDescription');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        const sdp = this._peerConnection.localDescription;
        if (!sdp) {
            return Promise.reject(new Error('Failed to get local session description'));
        }
        return Promise.resolve(sdp);
    }
    /**
     * Sets the peer connection's local session description.
     * @param sessionDescription - sessionDescription The session description.
     */
    setLocalSessionDescription(sessionDescription) {
        this.logger.debug('SessionDescriptionHandler.setLocalSessionDescription');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        return this._peerConnection.setLocalDescription(sessionDescription);
    }
    /**
     * Sets the peer connection's remote session description.
     * @param sessionDescription - The session description.
     */
    setRemoteSessionDescription(sessionDescription) {
        this.logger.debug('SessionDescriptionHandler.setRemoteSessionDescription');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        const sdp = sessionDescription.sdp;
        let type;
        switch (this._peerConnection.signalingState) {
            case 'stable':
                // if we are stable assume this is a remote offer
                type = 'offer';
                break;
            case 'have-local-offer':
                // if we made an offer, assume this is a remote answer
                type = 'answer';
                break;
            case 'have-local-pranswer':
            case 'have-remote-offer':
            case 'have-remote-pranswer':
            case 'closed':
            default:
                return Promise.reject(new Error('Invalid signaling state ' + this._peerConnection.signalingState));
        }
        if (!sdp) {
            this.logger.error('SessionDescriptionHandler.setRemoteSessionDescription failed - cannot set null sdp');
            return Promise.reject(new Error('SDP is undefined'));
        }
        return this._peerConnection.setRemoteDescription({ sdp, type });
    }
    /**
     * Sets a remote media stream track.
     *
     * @remarks
     * Adds tracks if audio and/or video tracks are not already present, otherwise replaces tracks.
     *
     * @param track - Media stream track to be utilized.
     */
    setRemoteTrack(track) {
        this.logger.debug('SessionDescriptionHandler.setRemoteTrack');
        const remoteStream = this._remoteMediaStream;
        if (remoteStream.getTrackById(track.id)) {
            this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - have remote ${track.kind} track`);
        }
        else if (track.kind === 'audio') {
            this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${track.kind} track`);
            remoteStream.getAudioTracks().forEach((track) => {
                track.stop();
                remoteStream.removeTrack(track);
                SessionDescriptionHandler.dispatchRemoveTrackEvent(remoteStream, track);
            });
            remoteStream.addTrack(track);
            SessionDescriptionHandler.dispatchAddTrackEvent(remoteStream, track);
        }
        else if (track.kind === 'video') {
            this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${track.kind} track`);
            remoteStream.getVideoTracks().forEach((track) => {
                track.stop();
                remoteStream.removeTrack(track);
                SessionDescriptionHandler.dispatchRemoveTrackEvent(remoteStream, track);
            });
            remoteStream.addTrack(track);
            SessionDescriptionHandler.dispatchAddTrackEvent(remoteStream, track);
        }
    }
    /**
     * Depending on the current signaling state and the session hold state, update transceiver direction.
     * @param options - Session description handler options.
     */
    updateDirection(options) {
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        // 4.2.3.  setDirection
        //
        //    The setDirection method sets the direction of a transceiver, which
        //    affects the direction property of the associated "m=" section on
        //    future calls to createOffer and createAnswer.  The permitted values
        //    for direction are "recvonly", "sendrecv", "sendonly", and "inactive",
        //    mirroring the identically named direction attributes defined in
        //    [RFC4566], Section 6.
        //
        //    When creating offers, the transceiver direction is directly reflected
        //    in the output, even for re-offers.  When creating answers, the
        //    transceiver direction is intersected with the offered direction, as
        //    explained in Section 5.3 below.
        //
        //    Note that while setDirection sets the direction property of the
        //    transceiver immediately (Section 4.2.4), this property does not
        //    immediately affect whether the transceiver's RtpSender will send or
        //    its RtpReceiver will receive.  The direction in effect is represented
        //    by the currentDirection property, which is only updated when an
        //    answer is applied.
        //
        // 4.2.4.  direction
        //
        //    The direction property indicates the last value passed into
        //    setDirection.  If setDirection has never been called, it is set to
        //    the direction the transceiver was initialized with.
        //
        // 4.2.5.  currentDirection
        //
        //    The currentDirection property indicates the last negotiated direction
        //    for the transceiver's associated "m=" section.  More specifically, it
        //    indicates the direction attribute [RFC3264] of the associated "m="
        //    section in the last applied answer (including provisional answers),
        //    with "send" and "recv" directions reversed if it was a remote answer.
        //    For example, if the direction attribute for the associated "m="
        //    section in a remote answer is "recvonly", currentDirection is set to
        //    "sendonly".
        //
        //    If an answer that references this transceiver has not yet been
        //    applied or if the transceiver is stopped, currentDirection is set to
        //    "null".
        //  https://tools.ietf.org/html/rfc8829#section-4.2.3
        //
        // *  A direction attribute, determined by applying the rules regarding
        //    the offered direction specified in [RFC3264], Section 6.1, and
        //    then intersecting with the direction of the associated
        //    RtpTransceiver.  For example, in the case where an "m=" section is
        //    offered as "sendonly" and the local transceiver is set to
        //    "sendrecv", the result in the answer is a "recvonly" direction.
        // https://tools.ietf.org/html/rfc8829#section-5.3.1
        //
        // If a stream is offered as sendonly, the corresponding stream MUST be
        // marked as recvonly or inactive in the answer.  If a media stream is
        // listed as recvonly in the offer, the answer MUST be marked as
        // sendonly or inactive in the answer.  If an offered media stream is
        // listed as sendrecv (or if there is no direction attribute at the
        // media or session level, in which case the stream is sendrecv by
        // default), the corresponding stream in the answer MAY be marked as
        // sendonly, recvonly, sendrecv, or inactive.  If an offered media
        // stream is listed as inactive, it MUST be marked as inactive in the
        // answer.
        // https://tools.ietf.org/html/rfc3264#section-6.1
        switch (this._peerConnection.signalingState) {
            case 'stable':
                // if we are stable, assume we are creating a local offer
                this.logger.debug('SessionDescriptionHandler.updateDirection - setting offer direction');
                {
                    // determine the direction to offer given the current direction and hold state
                    const directionToOffer = (currentDirection) => {
                        switch (currentDirection) {
                            case 'inactive':
                                return options?.hold ? 'inactive' : 'recvonly';
                            case 'recvonly':
                                return options?.hold ? 'inactive' : 'recvonly';
                            case 'sendonly':
                                return options?.hold ? 'sendonly' : 'sendrecv';
                            case 'sendrecv':
                                return options?.hold ? 'sendonly' : 'sendrecv';
                            case 'stopped':
                                return 'stopped';
                            default:
                                throw new Error('Should never happen');
                        }
                    };
                    // set the transceiver direction to the offer direction
                    this._peerConnection.getTransceivers().forEach((transceiver) => {
                        if (transceiver.direction /* guarding, but should always be true */) {
                            const offerDirection = directionToOffer(transceiver.direction);
                            if (transceiver.direction !== offerDirection) {
                                transceiver.direction = offerDirection;
                            }
                        }
                    });
                }
                break;
            case 'have-remote-offer':
                // if we have a remote offer, assume we are creating a local answer
                this.logger.debug('SessionDescriptionHandler.updateDirection - setting answer direction');
                // FIXME: This is not the correct way to determine the answer direction as it is only
                // considering first match in the offered SDP and using that to determine the answer direction.
                // While that may be fine for our current use cases, it is not a generally correct approach.
                {
                    // determine the offered direction
                    const offeredDirection = (() => {
                        const description = this._peerConnection.remoteDescription;
                        if (!description) {
                            throw new Error('Failed to read remote offer');
                        }
                        const searchResult = /a=sendrecv\r\n|a=sendonly\r\n|a=recvonly\r\n|a=inactive\r\n/.exec(description.sdp);
                        if (searchResult) {
                            switch (searchResult[0]) {
                                case 'a=inactive\r\n':
                                    return 'inactive';
                                case 'a=recvonly\r\n':
                                    return 'recvonly';
                                case 'a=sendonly\r\n':
                                    return 'sendonly';
                                case 'a=sendrecv\r\n':
                                    return 'sendrecv';
                                default:
                                    throw new Error('Should never happen');
                            }
                        }
                        return 'sendrecv';
                    })();
                    // determine the answer direction based on the offered direction and our hold state
                    const answerDirection = (() => {
                        switch (offeredDirection) {
                            case 'inactive':
                                return 'inactive';
                            case 'recvonly':
                                return 'sendonly';
                            case 'sendonly':
                                return options?.hold ? 'inactive' : 'recvonly';
                            case 'sendrecv':
                                return options?.hold ? 'sendonly' : 'sendrecv';
                            default:
                                throw new Error('Should never happen');
                        }
                    })();
                    // set the transceiver direction to the answer direction
                    this._peerConnection.getTransceivers().forEach((transceiver) => {
                        if (transceiver.direction /* guarding, but should always be true */) {
                            if (transceiver.direction !== 'stopped' && transceiver.direction !== answerDirection) {
                                transceiver.direction = answerDirection;
                            }
                        }
                    });
                }
                break;
            case 'have-local-offer':
            case 'have-local-pranswer':
            case 'have-remote-pranswer':
            case 'closed':
            default:
                return Promise.reject(new Error('Invalid signaling state ' + this._peerConnection.signalingState));
        }
        return Promise.resolve();
    }
    /**
     * Called when ICE gathering completes and resolves any waiting promise.
     */
    iceGatheringComplete() {
        this.logger.debug('SessionDescriptionHandler.iceGatheringComplete');
        // clear timer if need be
        if (this.iceGatheringCompleteTimeoutId !== undefined) {
            this.logger.debug('SessionDescriptionHandler.iceGatheringComplete - clearing timeout');
            clearTimeout(this.iceGatheringCompleteTimeoutId);
            this.iceGatheringCompleteTimeoutId = undefined;
        }
        // resolve and cleanup promise if need be
        if (this.iceGatheringCompletePromise !== undefined) {
            this.logger.debug('SessionDescriptionHandler.iceGatheringComplete - resolving promise');
            this.iceGatheringCompleteResolve?.();
            this.iceGatheringCompletePromise = undefined;
            this.iceGatheringCompleteResolve = undefined;
            this.iceGatheringCompleteReject = undefined;
        }
    }
    /**
     * Wait for ICE gathering to complete.
     * @param restart - If true, waits if current state is "complete" (waits for transition to "complete").
     * @param timeout - Milliseconds after which waiting times out. No timeout if 0.
     */
    waitForIceGatheringComplete(restart = false, timeout = 0) {
        this.logger.debug('SessionDescriptionHandler.waitForIceGatheringToComplete');
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error('Peer connection closed.'));
        }
        // guard already complete
        if (!restart && this._peerConnection.iceGatheringState === 'complete') {
            this.logger.debug('SessionDescriptionHandler.waitForIceGatheringToComplete - already complete');
            return Promise.resolve();
        }
        // only one may be waiting, reject any prior
        if (this.iceGatheringCompletePromise !== undefined) {
            this.logger.debug('SessionDescriptionHandler.waitForIceGatheringToComplete - rejecting prior waiting promise');
            this.iceGatheringCompleteReject?.(new Error('Promise superseded.'));
            this.iceGatheringCompletePromise = undefined;
            this.iceGatheringCompleteResolve = undefined;
            this.iceGatheringCompleteReject = undefined;
        }
        this.iceGatheringCompletePromise = new Promise((resolve, reject) => {
            this.iceGatheringCompleteResolve = resolve;
            this.iceGatheringCompleteReject = reject;
            if (timeout > 0) {
                this.logger.debug('SessionDescriptionHandler.waitForIceGatheringToComplete - timeout in ' + timeout);
                this.iceGatheringCompleteTimeoutId = setTimeout(() => {
                    this.logger.debug('SessionDescriptionHandler.waitForIceGatheringToComplete - timeout');
                    this.iceGatheringComplete();
                }, timeout);
            }
        });
        return this.iceGatheringCompletePromise;
    }
    /**
     * Initializes the peer connection event handlers
     */
    initPeerConnectionEventHandlers() {
        this.logger.debug('SessionDescriptionHandler.initPeerConnectionEventHandlers');
        if (!this._peerConnection) {
            throw new Error('Peer connection undefined.');
        }
        const peerConnection = this._peerConnection;
        peerConnection.onconnectionstatechange = (event) => {
            const newState = peerConnection.connectionState;
            this.logger.debug(`SessionDescriptionHandler.onconnectionstatechange ${newState}`);
            if (this._peerConnectionDelegate?.onconnectionstatechange) {
                this._peerConnectionDelegate.onconnectionstatechange(event);
            }
        };
        peerConnection.ondatachannel = (event) => {
            this.logger.debug('SessionDescriptionHandler.ondatachannel');
            this._dataChannel = event.channel;
            if (this.onDataChannel) {
                this.onDataChannel(this._dataChannel);
            }
            if (this._peerConnectionDelegate?.ondatachannel) {
                this._peerConnectionDelegate.ondatachannel(event);
            }
        };
        peerConnection.onicecandidate = (event) => {
            this.logger.debug('SessionDescriptionHandler.onicecandidate');
            if (this._peerConnectionDelegate?.onicecandidate) {
                this._peerConnectionDelegate.onicecandidate(event);
            }
        };
        peerConnection.onicecandidateerror = ((event) => {
            this.logger.debug('SessionDescriptionHandler.onicecandidateerror');
            if (this._peerConnectionDelegate?.onicecandidateerror) {
                this._peerConnectionDelegate.onicecandidateerror(event);
            }
        });
        peerConnection.oniceconnectionstatechange = (event) => {
            const newState = peerConnection.iceConnectionState;
            this.logger.debug(`SessionDescriptionHandler.oniceconnectionstatechange ${newState}`);
            if (this._peerConnectionDelegate?.oniceconnectionstatechange) {
                this._peerConnectionDelegate.oniceconnectionstatechange(event);
            }
        };
        peerConnection.onicegatheringstatechange = (event) => {
            const newState = peerConnection.iceGatheringState;
            this.logger.debug(`SessionDescriptionHandler.onicegatheringstatechange ${newState}`);
            if (newState === 'complete') {
                this.iceGatheringComplete(); // complete waiting for ICE gathering to complete
            }
            if (this._peerConnectionDelegate?.onicegatheringstatechange) {
                this._peerConnectionDelegate.onicegatheringstatechange(event);
            }
        };
        peerConnection.onnegotiationneeded = (event) => {
            this.logger.debug('SessionDescriptionHandler.onnegotiationneeded');
            if (this._peerConnectionDelegate?.onnegotiationneeded) {
                this._peerConnectionDelegate.onnegotiationneeded(event);
            }
        };
        peerConnection.onsignalingstatechange = (event) => {
            const newState = peerConnection.signalingState;
            this.logger.debug(`SessionDescriptionHandler.onsignalingstatechange ${newState}`);
            if (this._peerConnectionDelegate?.onsignalingstatechange) {
                this._peerConnectionDelegate.onsignalingstatechange(event);
            }
        };
        // onstatsended is no longer a part of PeerConnection as per the specs so removing it
        // peerConnection.onstatsended = (event): void => {
        //     this.logger.debug(`SessionDescriptionHandler.onstatsended`);
        //     if (this._peerConnectionDelegate?.onstatsended) {
        //         this._peerConnectionDelegate.onstatsended(event);
        //     }
        // };
        peerConnection.ontrack = (event) => {
            const kind = event.track.kind;
            const enabled = event.track.enabled ? 'enabled' : 'disabled';
            this.logger.debug(`SessionDescriptionHandler.ontrack ${kind} ${enabled}`);
            this.setRemoteTrack(event.track);
            if (this._peerConnectionDelegate?.ontrack) {
                this._peerConnectionDelegate.ontrack(event);
            }
        };
    }
}
function defaultPeerConnectionConfiguration() {
    const config = {
        bundlePolicy: 'balanced',
        certificates: undefined,
        iceCandidatePoolSize: 0,
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        iceTransportPolicy: 'all',
        rtcpMuxPolicy: 'require',
    };
    return config;
}
function defaultMediaStreamFactory() {
    return (constraints) => {
        // if no audio or video, return a media stream without tracks
        if (!constraints.audio && !constraints.video) {
            return Promise.resolve(new MediaStream());
        }
        // getUserMedia() is a powerful feature which can only be used in secure contexts; in insecure contexts,
        // navigator.mediaDevices is undefined, preventing access to getUserMedia(). A secure context is, in short,
        // a page loaded using HTTPS or the file:/// URL scheme, or a page loaded from localhost.
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Privacy_and_security
        if (navigator.mediaDevices === undefined) {
            return Promise.reject(new Error('Media devices not available in insecure contexts.'));
        }
        return navigator.mediaDevices.getUserMedia(constraints);
    };
}
const defaultSessionDescriptionFactory = (session, options) => {
    const mediaStreamFactory = defaultMediaStreamFactory();
    // make sure we allow `0` to be passed in so timeout can be disabled
    const iceGatheringTimeout = options?.iceGatheringTimeout !== undefined ? options?.iceGatheringTimeout : 5000;
    // merge passed factory options into default session description configuration
    const sessionDescriptionHandlerConfiguration = {
        iceGatheringTimeout,
        enableDscp: options.enableDscp,
        peerConnectionConfiguration: {
            ...defaultPeerConnectionConfiguration(),
            ...options?.peerConnectionConfiguration,
        },
    };
    const logger = session.userAgent.getLogger('sip.SessionDescriptionHandler');
    return new SessionDescriptionHandler(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration);
};


/***/ }),

/***/ "./src/transport.ts":
/*!**************************!*\
  !*** ./src/transport.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWebPhoneTransport: () => (/* binding */ createWebPhoneTransport)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sip.js */ "sip.js");
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sip_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./events */ "./src/events.ts");



function createWebPhoneTransport(transport, options) {
    transport.reconnectionAttempts = 0;
    transport.sipErrorCodes = options.sipErrorCodes;
    transport.servers = options.transportServers;
    const eventEmitter = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    transport.on = eventEmitter.on.bind(eventEmitter);
    transport.off = eventEmitter.off.bind(eventEmitter);
    transport.once = eventEmitter.once.bind(eventEmitter);
    transport.addListener = eventEmitter.addListener.bind(eventEmitter);
    transport.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    transport.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
    transport.emit = eventEmitter.emit.bind(eventEmitter);
    transport.mainProxy = options.transportServers[0];
    transport.switchBackInterval = options.switchBackInterval;
    transport.reconnectionTimeout = options.reconnectionTimeout;
    transport.maxReconnectionAttempts = options.maxReconnectionAttempts;
    transport.__afterWSConnected = __afterWSConnected.bind(transport);
    transport.__clearSwitchBackToMainProxyTimer = __clearSwitchBackToMainProxyTimer.bind(transport);
    transport.__computeRandomTimeout = __computeRandomTimeout.bind(transport);
    transport.__connect = transport.connect;
    transport.__isCurrentMainProxy = __isCurrentMainProxy.bind(transport);
    transport.__onConnectedToBackup = __onConnectedToBackup.bind(transport);
    transport.__onConnectedToMain = __onConnectedToMain.bind(transport);
    transport.__resetServersErrorStatus = __resetServersErrorStatus.bind(transport);
    transport.__scheduleSwitchBackToMainProxy = __scheduleSwitchBackToMainProxy.bind(transport);
    transport.__setServerIsError = __setServerIsError.bind(transport);
    transport.connect = __connect.bind(transport);
    transport.getNextWsServer = getNextWsServer.bind(transport);
    transport.isSipErrorCode = isSipErrorCode.bind(transport);
    transport.noAvailableServers = noAvailableServers.bind(transport);
    transport.onSipErrorCode = onSipErrorCode.bind(transport);
    transport.reconnect = reconnect.bind(transport);
    transport.stateChange.addListener((newState) => {
        switch (newState) {
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.TransportState.Connecting: {
                transport.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.Connecting);
                break;
            }
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.TransportState.Connected: {
                transport.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.Connected);
                transport.__afterWSConnected();
                break;
            }
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.TransportState.Disconnecting: {
                transport.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.Disconnecting);
                break;
            }
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.TransportState.Disconnected: {
                transport.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.Disconnected);
                break;
            }
        }
    });
    return transport;
}
function __connect() {
    return this.__connect().catch(async (e) => {
        this.logger.error(`unable to establish connection to server ${this.server} - ${e.message}`);
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.ConnectionAttemptFailure, e); // Can we move to onTransportDisconnect?
        await this.reconnect();
    });
}
function __computeRandomTimeout(reconnectionAttempts = 1, randomMinInterval = 0, randomMaxInterval = 0) {
    if (randomMinInterval < 0 || randomMaxInterval < 0 || reconnectionAttempts < 1) {
        throw new Error('Arguments must be positive numbers');
    }
    const randomInterval = Math.floor(Math.random() * Math.abs(randomMaxInterval - randomMinInterval)) + randomMinInterval;
    const retryOffset = ((reconnectionAttempts - 1) * (randomMinInterval + randomMaxInterval)) / 2;
    return randomInterval + retryOffset;
}
function __setServerIsError(uri) {
    this.servers.forEach((server) => {
        if (server.uri === uri && !server.isError) {
            server.isError = true;
        }
    });
}
function __resetServersErrorStatus() {
    this.servers.forEach((server) => {
        server.isError = false;
    });
}
function __isCurrentMainProxy() {
    return this.server === this.servers[0].uri;
}
function __afterWSConnected() {
    this.__isCurrentMainProxy() ? this.__onConnectedToMain() : this.__onConnectedToBackup();
}
function __onConnectedToMain() {
    this.__clearSwitchBackToMainProxyTimer();
}
function __onConnectedToBackup() {
    if (!this.switchBackToMainProxyTimer) {
        this.__scheduleSwitchBackToMainProxy();
    }
}
function __scheduleSwitchBackToMainProxy() {
    const randomInterval = 15 * 60 * 1000; // 15 min
    let switchBackInterval = this.switchBackInterval ? this.switchBackInterval * 1000 : null;
    // Add random time to expand clients connections in time;
    if (switchBackInterval) {
        switchBackInterval += this.__computeRandomTimeout(1, 0, randomInterval);
        this.logger.warn('Try to switch back to main proxy after ' + Math.round(switchBackInterval / 1000 / 60) + ' min');
        this.switchBackToMainProxyTimer = setTimeout(() => {
            this.switchBackToMainProxyTimer = null;
            this.logger.warn('switchBack initiated');
            this.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.SwitchBackToMainProxy);
            // FIXME: Why is force reconnect not called here and the client is made to do that?
        }, switchBackInterval);
    }
    else {
        this.logger.warn('switchBackInterval is not set. Will be switched with next provision update ');
    }
}
function __clearSwitchBackToMainProxyTimer() {
    if (this.switchBackToMainProxyTimer) {
        clearTimeout(this.switchBackToMainProxyTimer);
        this.switchBackToMainProxyTimer = null;
    }
}
async function reconnect(forceReconnectToMain) {
    if (this.reconnectionAttempts > 0) {
        this.logger.warn(`Reconnection attempt ${this.reconnectionAttempts} failed`);
    }
    if (this.reconnectTimer) {
        this.logger.warn('already trying to reconnect');
        return;
    }
    if (forceReconnectToMain) {
        this.logger.warn('forcing connect to main WS server');
        await this.disconnect();
        this.server = this.getNextWsServer(true).uri;
        this.reconnectionAttempts = 0;
        await this.connect();
        return;
    }
    if (this.isConnected()) {
        this.logger.warn('attempted to reconnect while connected - forcing disconnect');
        await this.disconnect();
        await this.reconnect();
        return;
    }
    if (this.noAvailableServers()) {
        this.logger.warn('no available WebSocket servers left');
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.Closed);
        this.__resetServersErrorStatus();
        this.server = this.getNextWsServer(true).uri;
        this.__clearSwitchBackToMainProxyTimer();
        return;
    }
    this.reconnectionAttempts += 1;
    if (this.reconnectionAttempts > this.maxReconnectionAttempts) {
        this.logger.warn(`maximum reconnection attempts for WebSocket ${this.server}`);
        this.logger.warn(`transport ${this.server} failed`);
        this.__setServerIsError(this.server);
        this.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.ConnectionFailure);
        const nextServer = this.getNextWsServer();
        if (!nextServer) {
            // No more servers available to try connecting to
            this.logger.error('unable to connect to any transport');
            return;
        }
        this.configuration.server = nextServer.uri;
        this.reconnectionAttempts = 0;
        await this.connect();
    }
    else {
        const randomMinInterval = (this.reconnectionTimeout - 2) * 1000;
        const randomMaxInterval = (this.reconnectionTimeout + 2) * 1000;
        this.nextReconnectInterval = this.__computeRandomTimeout(this.reconnectionAttempts, randomMinInterval, randomMaxInterval);
        this.logger.warn(`trying to reconnect to WebSocket ${this.server} (reconnection attempt: ${this.reconnectionAttempts})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = undefined;
            this.connect().then(() => {
                this.reconnectionAttempts = 0;
            });
        }, this.nextReconnectInterval);
        this.logger.warn(`next reconnection attempt in: ${Math.round(this.nextReconnectInterval / 1000)} seconds.`);
    }
}
function getNextWsServer(force = false) {
    // Adding the force check because otherwise it will not bypass error check
    if (!force && this.noAvailableServers()) {
        this.logger.warn('attempted to get next ws server but there are no available ws servers left');
        return;
    }
    const candidates = force ? this.servers : this.servers.filter(({ isError }) => !isError);
    return candidates[0];
}
function noAvailableServers() {
    return this.servers.every(({ isError }) => isError);
}
function isSipErrorCode(statusCode) {
    if (!statusCode) {
        return false;
    }
    if (!this.sipErrorCodes) {
        return false;
    }
    return this.sipErrorCodes.indexOf(statusCode.toString()) !== -1;
}
async function onSipErrorCode() {
    this.logger.warn('Error received from the server. Disconnecting from the proxy');
    this.__setServerIsError(this.server);
    this.emit(_events__WEBPACK_IMPORTED_MODULE_2__.Events.Transport.ConnectionFailure);
    this.reconnectionAttempts = 0;
    return this.reconnect();
}


/***/ }),

/***/ "./src/userAgent.ts":
/*!**************************!*\
  !*** ./src/userAgent.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createWebPhoneUserAgent: () => (/* binding */ createWebPhoneUserAgent)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sip.js */ "sip.js");
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sip_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _transport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transport */ "./src/transport.ts");
/* harmony import */ var _audioHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./audioHelper */ "./src/audioHelper.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./events */ "./src/events.ts");
/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./session */ "./src/session.ts");
/* harmony import */ var _userAgentCore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./userAgentCore */ "./src/userAgentCore.ts");







/** @ignore */
// eslint-disable-next-line max-params
function createWebPhoneUserAgent(configuration, sipInfo, options, id) {
    const extraConfiguration = {
        delegate: {
            onConnect: () => userAgent.register(),
            onInvite: (invitation) => {
                userAgent.audioHelper.playIncoming(true);
                invitation.delegate = {};
                invitation.delegate.onSessionDescriptionHandler = () => (0,_session__WEBPACK_IMPORTED_MODULE_5__.onSessionDescriptionHandlerCreated)(invitation);
                (0,_session__WEBPACK_IMPORTED_MODULE_5__.patchWebphoneSession)(invitation);
                (0,_session__WEBPACK_IMPORTED_MODULE_5__.patchIncomingWebphoneSession)(invitation);
                invitation.logger.log('UA received incoming call invite');
                invitation.sendReceiveConfirm();
                userAgent.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.Invite, invitation);
            },
            onNotify: (notification) => {
                const event = notification.request.getHeader('Event');
                if (event === '') {
                    userAgent.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.ProvisionUpdate);
                }
                userAgent.logger.log('UA received notify');
                notification.accept();
            },
        },
    };
    const extendedConfiguration = {
        ...extraConfiguration,
        ...configuration,
    };
    const userAgent = new sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgent(extendedConfiguration);
    const eventEmitter = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    userAgent.on = eventEmitter.on.bind(eventEmitter);
    userAgent.off = eventEmitter.off.bind(eventEmitter);
    userAgent.once = eventEmitter.once.bind(eventEmitter);
    userAgent.addListener = eventEmitter.addListener.bind(eventEmitter);
    userAgent.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    userAgent.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
    userAgent.defaultHeaders = [`P-rc-endpoint-id: ${id}`, `Client-id: ${options.clientId}`];
    userAgent.regId = options.regId;
    userAgent.media = {};
    userAgent.enableQos = options.enableQos;
    userAgent.enableMediaReportLogging = options.enableMediaReportLogging;
    userAgent.qosCollectInterval = options.qosCollectInterval;
    if (options.media?.remote && options.media.local) {
        userAgent.media.remote = options.media.remote;
        userAgent.media.local = options.media.local;
    }
    else {
        userAgent.media = undefined;
    }
    userAgent.registerer = new sip_js__WEBPACK_IMPORTED_MODULE_1__.Registerer(userAgent, {
        regId: userAgent.regId,
        instanceId: userAgent.instanceId,
        extraHeaders: userAgent.defaultHeaders,
    });
    userAgent.sipInfo = sipInfo;
    userAgent.modifiers = options.modifiers;
    userAgent.constraints = options.mediaConstraints;
    userAgent.earlyMedia = options.earlyMedia;
    userAgent.audioHelper = new _audioHelper__WEBPACK_IMPORTED_MODULE_3__.AudioHelper(options.audioHelper);
    userAgent.onSession = options.onSession;
    userAgent._transport = (0,_transport__WEBPACK_IMPORTED_MODULE_2__.createWebPhoneTransport)(userAgent.transport, options);
    userAgent.onTransportDisconnect = onTransportDisconnect.bind(userAgent);
    userAgent.emit = eventEmitter.emit.bind(eventEmitter);
    userAgent.register = register.bind(userAgent);
    userAgent.unregister = unregister.bind(userAgent);
    userAgent.invite = invite.bind(userAgent);
    userAgent.sendMessage = sendMessage.bind(userAgent);
    userAgent.createRcMessage = createRcMessage.bind(userAgent);
    userAgent.switchFrom = switchFrom.bind(userAgent);
    (0,_userAgentCore__WEBPACK_IMPORTED_MODULE_6__.patchUserAgentCore)(userAgent);
    userAgent.start();
    userAgent.stateChange.addListener((newState) => {
        switch (newState) {
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgentState.Started: {
                userAgent.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.Started);
                break;
            }
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgentState.Stopped: {
                userAgent.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.Stopped);
                break;
            }
        }
    });
    userAgent.registerer.stateChange.addListener((newState) => {
        switch (newState) {
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.RegistererState.Registered: {
                userAgent.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.Registered);
                break;
            }
            case sip_js__WEBPACK_IMPORTED_MODULE_1__.RegistererState.Unregistered: {
                userAgent.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.Unregistered);
                break;
            }
        }
    });
    return userAgent;
}
function onTransportDisconnect(error) {
    // Patch it so that reconnection is managed by WebPhoneTransport
    if (this.state === sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgentState.Stopped) {
        return;
    }
    if (this.delegate?.onDisconnect) {
        this.delegate.onDisconnect(error);
    }
    if (error) {
        this.transport.reconnect();
    }
}
function createRcMessage(options) {
    options.body = options.body || '';
    return ('<Msg>' +
        '<Hdr SID="' +
        options.sid +
        '" Req="' +
        options.request +
        '" From="' +
        options.from +
        '" To="' +
        options.to +
        '" Cmd="' +
        options.reqid +
        '"/> ' +
        '<Bdy Cln="' +
        this.sipInfo.authorizationId +
        '" ' +
        options.body +
        '/>' +
        '</Msg>');
}
function sendMessage(_to, messageData) {
    const extraHeaders = [`P-rc-ws: ${this.contact}`];
    // For some reason, UserAgent.makeURI is unable to parse username starting with #
    // Fix in later release if this is fixed by SIP.js
    let to = _to;
    const [user] = to.split('@');
    to = to.startsWith('#') ? `sip:${to.substring(1)}` : `sip:${to}`;
    const uri = sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgent.makeURI(to);
    uri.user = user;
    const messager = new sip_js__WEBPACK_IMPORTED_MODULE_1__.Messager(this, uri, messageData, 'x-rc/agent', {
        extraHeaders,
    });
    return new Promise((resolve, reject) => {
        messager.message({
            requestDelegate: {
                onAccept: resolve,
                onReject: reject,
            },
        });
    });
}
async function register() {
    await this.registerer.register({
        requestDelegate: {
            onReject: (response) => {
                if (!response) {
                    return;
                }
                if (this.transport.isSipErrorCode(response.message.statusCode)) {
                    this.transport.onSipErrorCode();
                }
                this.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.RegistrationFailed, response);
                this.logger.warn('UA Registration Failed');
            },
        },
    });
}
async function unregister() {
    await this.registerer.unregister();
}
function invite(number, options = {}) {
    const inviterOptions = {};
    inviterOptions.extraHeaders = [
        ...(options.extraHeaders || []),
        ...this.defaultHeaders,
        `P-Asserted-Identity: sip:${(options.fromNumber || this.sipInfo.username) + '@' + this.sipInfo.domain}`,
        ...(options.homeCountryId ? [`P-rc-country-id: ${options.homeCountryId}`] : []),
    ];
    options.RTCConstraints = options.RTCConstraints || {
        ...this.constraints,
        optional: [{ DtlsSrtpKeyAgreement: 'true' }],
    };
    inviterOptions.sessionDescriptionHandlerModifiers = this.modifiers;
    inviterOptions.sessionDescriptionHandlerOptions = {
        constraints: options.RTCConstraints,
    };
    inviterOptions.earlyMedia = this.earlyMedia;
    inviterOptions.delegate = {
        onSessionDescriptionHandler: () => (0,_session__WEBPACK_IMPORTED_MODULE_5__.onSessionDescriptionHandlerCreated)(inviter),
        onNotify: (notification) => notification.accept(),
    };
    this.audioHelper.playOutgoing(true);
    this.logger.log(`Invite to ${number} created with playOutgoing set to true`);
    const inviter = new sip_js__WEBPACK_IMPORTED_MODULE_1__.Inviter(this, sip_js__WEBPACK_IMPORTED_MODULE_1__.UserAgent.makeURI(`sip:${number}@${this.sipInfo.domain}`), inviterOptions);
    inviter
        .invite({
        requestDelegate: {
            onAccept: (inviteResponse) => {
                inviter.startTime = new Date();
                inviter.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.Session.Accepted, inviteResponse.message);
            },
            onProgress: (inviteResponse) => {
                inviter.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.Session.Progress, inviteResponse.message);
            },
        },
    })
        .then(() => this.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.UserAgent.InviteSent, inviter))
        .catch((e) => {
        if (e.message.indexOf('Permission denied') > -1) {
            inviter.emit(_events__WEBPACK_IMPORTED_MODULE_4__.Events.Session.UserMediaFailed);
        }
        throw e;
    });
    (0,_session__WEBPACK_IMPORTED_MODULE_5__.patchWebphoneSession)(inviter);
    return inviter;
}
/**
 * Support to switch call from other device to current web phone device
 * need active call information from details presence API for switching
 * https://developers.ringcentral.com/api-reference/Detailed-Extension-Presence-with-SIP-Event
 */
function switchFrom(activeCall, options = {}) {
    const replaceHeaders = [
        `Replaces: ${activeCall.id};to-tag=${activeCall.sipData.fromTag};from-tag=${activeCall.sipData.toTag}`,
        'RC-call-type: replace',
    ];
    const [toNumber, fromNumber] = activeCall.direction === 'Outbound' ? [activeCall.to, activeCall.from] : [activeCall.from, activeCall.to];
    options.extraHeaders = (options.extraHeaders || []).concat(replaceHeaders);
    options.fromNumber = options.fromNumber || fromNumber;
    const inviterOptions = {
        extraHeaders: options.extraHeaders,
        sessionDescriptionHandlerOptions: {
            constraints: options.RTCConstraints || this.constraints,
        },
    };
    return this.invite(toNumber, inviterOptions);
}


/***/ }),

/***/ "./src/userAgentCore.ts":
/*!******************************!*\
  !*** ./src/userAgentCore.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchUserAgentCore: () => (/* binding */ patchUserAgentCore)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sip_js_lib_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sip.js/lib/core */ "./node_modules/sip.js/lib/core/messages/methods/constants.js");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events */ "./src/events.ts");



/** @ignore */
function patchUserAgentCore(userAgent) {
    const userAgentCore = userAgent.userAgentCore;
    const eventEmitter = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    userAgentCore.on = eventEmitter.on.bind(eventEmitter);
    userAgentCore.off = eventEmitter.off.bind(eventEmitter);
    userAgentCore.addListener = eventEmitter.addListener.bind(eventEmitter);
    userAgentCore.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    userAgentCore.emit = eventEmitter.emit.bind(eventEmitter);
    userAgentCore._receiveIncomingRequestFromTransport = userAgentCore.receiveIncomingRequestFromTransport.bind(userAgent.userAgentCore);
    userAgentCore.receiveIncomingRequestFromTransport = receiveIncomingRequestFromTransport.bind(userAgent.userAgentCore);
}
function receiveIncomingRequestFromTransport(message) {
    switch (message.method) {
        case sip_js_lib_core__WEBPACK_IMPORTED_MODULE_2__.C.UPDATE: {
            this.logger.log('Receive UPDATE request. Do nothing just return 200 OK');
            this.replyStateless(message, { statusCode: 200 });
            this.emit(_events__WEBPACK_IMPORTED_MODULE_1__.Events.Session.UpdateReceived, message);
            return;
        }
        case sip_js_lib_core__WEBPACK_IMPORTED_MODULE_2__.C.INFO: {
            // For the Move2RCV request from server
            const content = getIncomingInfoContent(message);
            if (content?.request?.reqId && content?.request?.command === 'move' && content?.request?.target === 'rcv') {
                this.replyStateless(message, { statusCode: 200 });
                this.emit(_events__WEBPACK_IMPORTED_MODULE_1__.Events.Session.MoveToRcv, content.request);
                return;
            }
            // For other SIP INFO from server
            this.emit('RC_SIP_INFO', message);
            // SIP.js does not support application/json content type, so we monkey override its behavior in this case
            const contentType = message.getHeader('content-type');
            if (contentType.match(/^application\/json/i)) {
                this.replyStateless(message, { statusCode: 200 });
                return;
            }
            break;
        }
    }
    return this._receiveIncomingRequestFromTransport(message);
}
function getIncomingInfoContent(message) {
    if (!message?.body) {
        return {};
    }
    let ret = {};
    try {
        ret = JSON.parse(message.body);
    }
    catch (e) {
        return {};
    }
    return ret;
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* binding */ extend),
/* harmony export */   uuid: () => (/* binding */ uuid)
/* harmony export */ });
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
});
const extend = (dst = {}, src = {}) => Object.assign(dst || {}, src || {});


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "sip.js":
/*!***************************************************************************************!*\
  !*** external {"commonjs":"sip.js","commonjs2":"sip.js","amd":"sip.js","root":"SIP"} ***!
  \***************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_sip_js__;

/***/ }),

/***/ "./node_modules/sip.js/lib/api/session-state.js":
/*!******************************************************!*\
  !*** ./node_modules/sip.js/lib/api/session-state.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SessionState: () => (/* binding */ SessionState)
/* harmony export */ });
/**
 * {@link Session} state.
 *
 * @remarks
 * The {@link Session} behaves in a deterministic manner according to the following
 * Finite State Machine (FSM).
 * ```txt
 *                   ___________________________________________________________
 *                  |  ____________________________________________             |
 *                  | |            ____________________________    |            |
 * Session          | |           |                            v   v            v
 * Constructed -> Initial -> Establishing -> Established -> Terminating -> Terminated
 *                                |               |___________________________^   ^
 *                                |_______________________________________________|
 * ```
 * @public
 */
var SessionState;
(function (SessionState) {
    /**
     * If `Inviter`, INVITE not sent yet.
     * If `Invitation`, received INVITE (but no final response sent yet).
     */
    SessionState["Initial"] = "Initial";
    /**
     * If `Inviter`, sent INVITE and waiting for a final response.
     * If `Invitation`, received INVITE and attempting to send 200 final response (but has not sent it yet).
     */
    SessionState["Establishing"] = "Establishing";
    /**
     * If `Inviter`, sent INVITE and received 200 final response and sent ACK.
     * If `Invitation`, received INVITE and sent 200 final response.
     */
    SessionState["Established"] = "Established";
    /**
     * If `Inviter`, sent INVITE, sent CANCEL and now waiting for 487 final response to ACK (or 200 to ACK & BYE).
     * If `Invitation`, received INVITE, sent 200 final response and now waiting on ACK and upon receipt will attempt BYE
     * (as the protocol specification requires, before sending a BYE we must receive the ACK - so we are waiting).
     */
    SessionState["Terminating"] = "Terminating";
    /**
     * If `Inviter`, sent INVITE and received non-200 final response (or sent/received BYE after receiving 200).
     * If `Invitation`, received INVITE and sent non-200 final response (or sent/received BYE after sending 200).
     */
    SessionState["Terminated"] = "Terminated";
})(SessionState = SessionState || (SessionState = {}));


/***/ }),

/***/ "./node_modules/sip.js/lib/core/log/levels.js":
/*!****************************************************!*\
  !*** ./node_modules/sip.js/lib/core/log/levels.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Levels: () => (/* binding */ Levels)
/* harmony export */ });
/**
 * Log levels.
 * @public
 */
var Levels;
(function (Levels) {
    Levels[Levels["error"] = 0] = "error";
    Levels[Levels["warn"] = 1] = "warn";
    Levels[Levels["log"] = 2] = "log";
    Levels[Levels["debug"] = 3] = "debug";
})(Levels = Levels || (Levels = {}));


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/body.js":
/*!*******************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/body.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromBodyLegacy: () => (/* binding */ fromBodyLegacy),
/* harmony export */   getBody: () => (/* binding */ getBody),
/* harmony export */   isBody: () => (/* binding */ isBody)
/* harmony export */ });
/* harmony import */ var _incoming_request_message_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./incoming-request-message.js */ "./node_modules/sip.js/lib/core/messages/incoming-request-message.js");
/* harmony import */ var _incoming_response_message_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./incoming-response-message.js */ "./node_modules/sip.js/lib/core/messages/incoming-response-message.js");
/* harmony import */ var _outgoing_request_message_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./outgoing-request-message.js */ "./node_modules/sip.js/lib/core/messages/outgoing-request-message.js");



// If the Content-Disposition header field is missing, bodies of
// Content-Type application/sdp imply the disposition "session", while
// other content types imply "render".
// https://tools.ietf.org/html/rfc3261#section-13.2.1
function contentTypeToContentDisposition(contentType) {
    if (contentType === "application/sdp") {
        return "session";
    }
    else {
        return "render";
    }
}
/**
 * Create a Body given a legacy body type.
 * @param bodyLegacy - Body Object
 * @internal
 */
function fromBodyLegacy(bodyLegacy) {
    const content = typeof bodyLegacy === "string" ? bodyLegacy : bodyLegacy.body;
    const contentType = typeof bodyLegacy === "string" ? "application/sdp" : bodyLegacy.contentType;
    const contentDisposition = contentTypeToContentDisposition(contentType);
    const body = { contentDisposition, contentType, content };
    return body;
}
/**
 * User-Defined Type Guard for Body.
 * @param body - Body to check.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBody(body) {
    return body &&
        typeof body.content === "string" &&
        typeof body.contentType === "string" &&
        body.contentDisposition === undefined
        ? true
        : typeof body.contentDisposition === "string";
}
/**
 * Given a message, get a normalized body.
 * The content disposition is inferred if not set.
 * @param message - The message.
 * @internal
 */
function getBody(message) {
    let contentDisposition;
    let contentType;
    let content;
    // We're in UAS role, receiving incoming request
    if (message instanceof _incoming_request_message_js__WEBPACK_IMPORTED_MODULE_0__.IncomingRequestMessage) {
        if (message.body) {
            // FIXME: Parsing needs typing
            const parse = message.parseHeader("Content-Disposition");
            contentDisposition = parse ? parse.type : undefined;
            contentType = message.parseHeader("Content-Type");
            content = message.body;
        }
    }
    // We're in UAC role, receiving incoming response
    if (message instanceof _incoming_response_message_js__WEBPACK_IMPORTED_MODULE_1__.IncomingResponseMessage) {
        if (message.body) {
            // FIXME: Parsing needs typing
            const parse = message.parseHeader("Content-Disposition");
            contentDisposition = parse ? parse.type : undefined;
            contentType = message.parseHeader("Content-Type");
            content = message.body;
        }
    }
    // We're in UAC role, sending outgoing request
    if (message instanceof _outgoing_request_message_js__WEBPACK_IMPORTED_MODULE_2__.OutgoingRequestMessage) {
        if (message.body) {
            contentDisposition = message.getHeader("Content-Disposition");
            contentType = message.getHeader("Content-Type");
            if (typeof message.body === "string") {
                // FIXME: OutgoingRequest should not allow a "string" body without a "Content-Type" header.
                if (!contentType) {
                    throw new Error("Header content type header does not equal body content type.");
                }
                content = message.body;
            }
            else {
                // FIXME: OutgoingRequest should not allow the "Content-Type" header not to match th body content type
                if (contentType && contentType !== message.body.contentType) {
                    throw new Error("Header content type header does not equal body content type.");
                }
                contentType = message.body.contentType;
                content = message.body.body;
            }
        }
    }
    // We're in UAS role, sending outgoing response
    if (isBody(message)) {
        contentDisposition = message.contentDisposition;
        contentType = message.contentType;
        content = message.content;
    }
    // No content, no body.
    if (!content) {
        return undefined;
    }
    if (contentType && !contentDisposition) {
        contentDisposition = contentTypeToContentDisposition(contentType);
    }
    if (!contentDisposition) {
        throw new Error("Content disposition undefined.");
    }
    if (!contentType) {
        throw new Error("Content type undefined.");
    }
    return {
        contentDisposition,
        contentType,
        content
    };
}


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/incoming-message.js":
/*!*******************************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/incoming-message.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncomingMessage: () => (/* binding */ IncomingMessage)
/* harmony export */ });
/* harmony import */ var _grammar_grammar_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../grammar/grammar.js */ "./node_modules/sip.js/lib/grammar/grammar.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/sip.js/lib/core/messages/utils.js");


/**
 * Incoming message.
 * @public
 */
class IncomingMessage {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.headers = {};
    }
    /**
     * Insert a header of the given name and value into the last position of the
     * header array.
     * @param name - header name
     * @param value - header value
     */
    addHeader(name, value) {
        const header = { raw: value };
        name = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name);
        if (this.headers[name]) {
            this.headers[name].push(header);
        }
        else {
            this.headers[name] = [header];
        }
    }
    /**
     * Get the value of the given header name at the given position.
     * @param name - header name
     * @returns Returns the specified header, undefined if header doesn't exist.
     */
    getHeader(name) {
        const header = this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)];
        if (header) {
            if (header[0]) {
                return header[0].raw;
            }
        }
        else {
            return;
        }
    }
    /**
     * Get the header/s of the given name.
     * @param name - header name
     * @returns Array - with all the headers of the specified name.
     */
    getHeaders(name) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const header = this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)];
        const result = [];
        if (!header) {
            return [];
        }
        for (const headerPart of header) {
            result.push(headerPart.raw);
        }
        return result;
    }
    /**
     * Verify the existence of the given header.
     * @param name - header name
     * @returns true if header with given name exists, false otherwise
     */
    hasHeader(name) {
        return !!this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)];
    }
    /**
     * Parse the given header on the given index.
     * @param name - header name
     * @param idx - header index
     * @returns Parsed header object, undefined if the
     *   header is not present or in case of a parsing error.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseHeader(name, idx = 0) {
        name = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name);
        if (!this.headers[name]) {
            // this.logger.log("header '" + name + "' not present");
            return;
        }
        else if (idx >= this.headers[name].length) {
            // this.logger.log("not so many '" + name + "' headers present");
            return;
        }
        const header = this.headers[name][idx];
        const value = header.raw;
        if (header.parsed) {
            return header.parsed;
        }
        // substitute '-' by '_' for grammar rule matching.
        const parsed = _grammar_grammar_js__WEBPACK_IMPORTED_MODULE_1__.Grammar.parse(value, name.replace(/-/g, "_"));
        if (parsed === -1) {
            this.headers[name].splice(idx, 1); // delete from headers
            // this.logger.warn('error parsing "' + name + '" header field with value "' + value + '"');
            return;
        }
        else {
            header.parsed = parsed;
            return parsed;
        }
    }
    /**
     * Message Header attribute selector. Alias of parseHeader.
     * @param name - header name
     * @param idx - header index
     * @returns Parsed header object, undefined if the
     *   header is not present or in case of a parsing error.
     *
     * @example
     * message.s('via',3).port
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    s(name, idx = 0) {
        return this.parseHeader(name, idx);
    }
    /**
     * Replace the value of the given header by the value.
     * @param name - header name
     * @param value - header value
     */
    setHeader(name, value) {
        this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)] = [{ raw: value }];
    }
    toString() {
        return this.data;
    }
}


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/incoming-request-message.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/incoming-request-message.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncomingRequestMessage: () => (/* binding */ IncomingRequestMessage)
/* harmony export */ });
/* harmony import */ var _incoming_message_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./incoming-message.js */ "./node_modules/sip.js/lib/core/messages/incoming-message.js");

/**
 * Incoming request message.
 * @public
 */
class IncomingRequestMessage extends _incoming_message_js__WEBPACK_IMPORTED_MODULE_0__.IncomingMessage {
    constructor() {
        super();
    }
}


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/incoming-response-message.js":
/*!****************************************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/incoming-response-message.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IncomingResponseMessage: () => (/* binding */ IncomingResponseMessage)
/* harmony export */ });
/* harmony import */ var _incoming_message_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./incoming-message.js */ "./node_modules/sip.js/lib/core/messages/incoming-message.js");

/**
 * Incoming response message.
 * @public
 */
class IncomingResponseMessage extends _incoming_message_js__WEBPACK_IMPORTED_MODULE_0__.IncomingMessage {
    constructor() {
        super();
    }
}


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/methods/constants.js":
/*!********************************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/methods/constants.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ C)
/* harmony export */ });
/* eslint-disable @typescript-eslint/no-namespace */
/**
 * SIP Methods
 * @internal
 */
var C;
(function (C) {
    C.ACK = "ACK";
    C.BYE = "BYE";
    C.CANCEL = "CANCEL";
    C.INFO = "INFO";
    C.INVITE = "INVITE";
    C.MESSAGE = "MESSAGE";
    C.NOTIFY = "NOTIFY";
    C.OPTIONS = "OPTIONS";
    C.REGISTER = "REGISTER";
    C.UPDATE = "UPDATE";
    C.SUBSCRIBE = "SUBSCRIBE";
    C.PUBLISH = "PUBLISH";
    C.REFER = "REFER";
    C.PRACK = "PRACK";
})(C = C || (C = {}));


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/outgoing-request-message.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/outgoing-request-message.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OutgoingRequestMessage: () => (/* binding */ OutgoingRequestMessage)
/* harmony export */ });
/* harmony import */ var _grammar_name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../grammar/name-addr-header.js */ "./node_modules/sip.js/lib/grammar/name-addr-header.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/sip.js/lib/core/messages/utils.js");


/**
 * Outgoing SIP request message.
 * @public
 */
class OutgoingRequestMessage {
    constructor(method, ruri, fromURI, toURI, options, extraHeaders, body) {
        this.headers = {};
        this.extraHeaders = [];
        // Initialize default options
        this.options = OutgoingRequestMessage.getDefaultOptions();
        // Options - merge a deep copy
        if (options) {
            this.options = Object.assign(Object.assign({}, this.options), options);
            if (this.options.optionTags && this.options.optionTags.length) {
                this.options.optionTags = this.options.optionTags.slice();
            }
            if (this.options.routeSet && this.options.routeSet.length) {
                this.options.routeSet = this.options.routeSet.slice();
            }
        }
        // Extra headers - deep copy
        if (extraHeaders && extraHeaders.length) {
            this.extraHeaders = extraHeaders.slice();
        }
        // Body - deep copy
        if (body) {
            // TODO: internal representation should be Body
            // this.body = { ...body };
            this.body = {
                body: body.content,
                contentType: body.contentType
            };
        }
        // Method
        this.method = method;
        // RURI
        this.ruri = ruri.clone();
        // From
        this.fromURI = fromURI.clone();
        this.fromTag = this.options.fromTag ? this.options.fromTag : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.newTag)();
        this.from = OutgoingRequestMessage.makeNameAddrHeader(this.fromURI, this.options.fromDisplayName, this.fromTag);
        // To
        this.toURI = toURI.clone();
        this.toTag = this.options.toTag;
        this.to = OutgoingRequestMessage.makeNameAddrHeader(this.toURI, this.options.toDisplayName, this.toTag);
        // Call-ID
        this.callId = this.options.callId ? this.options.callId : this.options.callIdPrefix + (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createRandomToken)(15);
        // CSeq
        this.cseq = this.options.cseq;
        // The relative order of header fields with different field names is not
        // significant.  However, it is RECOMMENDED that header fields which are
        // needed for proxy processing (Via, Route, Record-Route, Proxy-Require,
        // Max-Forwards, and Proxy-Authorization, for example) appear towards
        // the top of the message to facilitate rapid parsing.
        // https://tools.ietf.org/html/rfc3261#section-7.3.1
        this.setHeader("route", this.options.routeSet);
        this.setHeader("via", "");
        this.setHeader("to", this.to.toString());
        this.setHeader("from", this.from.toString());
        this.setHeader("cseq", this.cseq + " " + this.method);
        this.setHeader("call-id", this.callId);
        this.setHeader("max-forwards", "70");
    }
    /** Get a copy of the default options. */
    static getDefaultOptions() {
        return {
            callId: "",
            callIdPrefix: "",
            cseq: 1,
            toDisplayName: "",
            toTag: "",
            fromDisplayName: "",
            fromTag: "",
            forceRport: false,
            hackViaTcp: false,
            optionTags: ["outbound"],
            routeSet: [],
            userAgentString: "sip.js",
            viaHost: ""
        };
    }
    static makeNameAddrHeader(uri, displayName, tag) {
        const parameters = {};
        if (tag) {
            parameters.tag = tag;
        }
        return new _grammar_name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(uri, displayName, parameters);
    }
    /**
     * Get the value of the given header name at the given position.
     * @param name - header name
     * @returns Returns the specified header, undefined if header doesn't exist.
     */
    getHeader(name) {
        const header = this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)];
        if (header) {
            if (header[0]) {
                return header[0];
            }
        }
        else {
            const regexp = new RegExp("^\\s*" + name + "\\s*:", "i");
            for (const exHeader of this.extraHeaders) {
                if (regexp.test(exHeader)) {
                    return exHeader.substring(exHeader.indexOf(":") + 1).trim();
                }
            }
        }
        return;
    }
    /**
     * Get the header/s of the given name.
     * @param name - header name
     * @returns Array with all the headers of the specified name.
     */
    getHeaders(name) {
        const result = [];
        const headerArray = this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)];
        if (headerArray) {
            for (const headerPart of headerArray) {
                result.push(headerPart);
            }
        }
        else {
            const regexp = new RegExp("^\\s*" + name + "\\s*:", "i");
            for (const exHeader of this.extraHeaders) {
                if (regexp.test(exHeader)) {
                    result.push(exHeader.substring(exHeader.indexOf(":") + 1).trim());
                }
            }
        }
        return result;
    }
    /**
     * Verify the existence of the given header.
     * @param name - header name
     * @returns true if header with given name exists, false otherwise
     */
    hasHeader(name) {
        if (this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)]) {
            return true;
        }
        else {
            const regexp = new RegExp("^\\s*" + name + "\\s*:", "i");
            for (const extraHeader of this.extraHeaders) {
                if (regexp.test(extraHeader)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Replace the the given header by the given value.
     * @param name - header name
     * @param value - header value
     */
    setHeader(name, value) {
        this.headers[(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.headerize)(name)] = value instanceof Array ? value : [value];
    }
    /**
     * The Via header field indicates the transport used for the transaction
     * and identifies the location where the response is to be sent.  A Via
     * header field value is added only after the transport that will be
     * used to reach the next hop has been selected (which may involve the
     * usage of the procedures in [4]).
     *
     * When the UAC creates a request, it MUST insert a Via into that
     * request.  The protocol name and protocol version in the header field
     * MUST be SIP and 2.0, respectively.  The Via header field value MUST
     * contain a branch parameter.  This parameter is used to identify the
     * transaction created by that request.  This parameter is used by both
     * the client and the server.
     * https://tools.ietf.org/html/rfc3261#section-8.1.1.7
     * @param branchParameter - The branch parameter.
     * @param transport - The sent protocol transport.
     */
    setViaHeader(branch, transport) {
        // FIXME: Hack
        if (this.options.hackViaTcp) {
            transport = "TCP";
        }
        let via = "SIP/2.0/" + transport;
        via += " " + this.options.viaHost + ";branch=" + branch;
        if (this.options.forceRport) {
            via += ";rport";
        }
        this.setHeader("via", via);
        this.branch = branch;
    }
    toString() {
        let msg = "";
        msg += this.method + " " + this.ruri.toRaw() + " SIP/2.0\r\n";
        for (const header in this.headers) {
            if (this.headers[header]) {
                for (const headerPart of this.headers[header]) {
                    msg += header + ": " + headerPart + "\r\n";
                }
            }
        }
        for (const header of this.extraHeaders) {
            msg += header.trim() + "\r\n";
        }
        msg += "Supported: " + this.options.optionTags.join(", ") + "\r\n";
        msg += "User-Agent: " + this.options.userAgentString + "\r\n";
        if (this.body) {
            if (typeof this.body === "string") {
                msg += "Content-Length: " + (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.utf8Length)(this.body) + "\r\n\r\n";
                msg += this.body;
            }
            else {
                if (this.body.body && this.body.contentType) {
                    msg += "Content-Type: " + this.body.contentType + "\r\n";
                    msg += "Content-Length: " + (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.utf8Length)(this.body.body) + "\r\n\r\n";
                    msg += this.body.body;
                }
                else {
                    msg += "Content-Length: " + 0 + "\r\n\r\n";
                }
            }
        }
        else {
            msg += "Content-Length: " + 0 + "\r\n\r\n";
        }
        return msg;
    }
}


/***/ }),

/***/ "./node_modules/sip.js/lib/core/messages/utils.js":
/*!********************************************************!*\
  !*** ./node_modules/sip.js/lib/core/messages/utils.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRandomToken: () => (/* binding */ createRandomToken),
/* harmony export */   getReasonPhrase: () => (/* binding */ getReasonPhrase),
/* harmony export */   headerize: () => (/* binding */ headerize),
/* harmony export */   newTag: () => (/* binding */ newTag),
/* harmony export */   utf8Length: () => (/* binding */ utf8Length)
/* harmony export */ });
/**
 * SIP Response Reasons
 * DOC: http://www.iana.org/assignments/sip-parameters
 * @internal
 */
const REASON_PHRASE = {
    100: "Trying",
    180: "Ringing",
    181: "Call Is Being Forwarded",
    182: "Queued",
    183: "Session Progress",
    199: "Early Dialog Terminated",
    200: "OK",
    202: "Accepted",
    204: "No Notification",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Moved Temporarily",
    305: "Use Proxy",
    380: "Alternative Service",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    410: "Gone",
    412: "Conditional Request Failed",
    413: "Request Entity Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Unsupported URI Scheme",
    417: "Unknown Resource-Priority",
    420: "Bad Extension",
    421: "Extension Required",
    422: "Session Interval Too Small",
    423: "Interval Too Brief",
    428: "Use Identity Header",
    429: "Provide Referrer Identity",
    430: "Flow Failed",
    433: "Anonymity Disallowed",
    436: "Bad Identity-Info",
    437: "Unsupported Certificate",
    438: "Invalid Identity Header",
    439: "First Hop Lacks Outbound Support",
    440: "Max-Breadth Exceeded",
    469: "Bad Info Package",
    470: "Consent Needed",
    478: "Unresolvable Destination",
    480: "Temporarily Unavailable",
    481: "Call/Transaction Does Not Exist",
    482: "Loop Detected",
    483: "Too Many Hops",
    484: "Address Incomplete",
    485: "Ambiguous",
    486: "Busy Here",
    487: "Request Terminated",
    488: "Not Acceptable Here",
    489: "Bad Event",
    491: "Request Pending",
    493: "Undecipherable",
    494: "Security Agreement Required",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Server Time-out",
    505: "Version Not Supported",
    513: "Message Too Large",
    580: "Precondition Failure",
    600: "Busy Everywhere",
    603: "Decline",
    604: "Does Not Exist Anywhere",
    606: "Not Acceptable"
};
/**
 * @param size -
 * @param base -
 * @internal
 */
function createRandomToken(size, base = 32) {
    let token = "";
    for (let i = 0; i < size; i++) {
        const r = Math.floor(Math.random() * base);
        token += r.toString(base);
    }
    return token;
}
/**
 * @internal
 */
function getReasonPhrase(code) {
    return REASON_PHRASE[code] || "";
}
/**
 * @internal
 */
function newTag() {
    return createRandomToken(10);
}
/**
 * @param str -
 * @internal
 */
function headerize(str) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exceptions = {
        "Call-Id": "Call-ID",
        Cseq: "CSeq",
        "Min-Se": "Min-SE",
        Rack: "RAck",
        Rseq: "RSeq",
        "Www-Authenticate": "WWW-Authenticate"
    };
    const name = str.toLowerCase().replace(/_/g, "-").split("-");
    const parts = name.length;
    let hname = "";
    for (let part = 0; part < parts; part++) {
        if (part !== 0) {
            hname += "-";
        }
        hname += name[part].charAt(0).toUpperCase() + name[part].substring(1);
    }
    if (exceptions[hname]) {
        hname = exceptions[hname];
    }
    return hname;
}
/**
 * @param str -
 * @internal
 */
function utf8Length(str) {
    return encodeURIComponent(str).replace(/%[A-F\d]{2}/g, "U").length;
}


/***/ }),

/***/ "./node_modules/sip.js/lib/grammar/grammar.js":
/*!****************************************************!*\
  !*** ./node_modules/sip.js/lib/grammar/grammar.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Grammar: () => (/* binding */ Grammar)
/* harmony export */ });
/* harmony import */ var _pegjs_dist_grammar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pegjs/dist/grammar.js */ "./node_modules/sip.js/lib/grammar/pegjs/dist/grammar.js");
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-inner-declarations */

/**
 * Grammar.
 * @internal
 */
var Grammar;
(function (Grammar) {
    /**
     * Parse.
     * @param input -
     * @param startRule -
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function parse(input, startRule) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = { startRule };
        try {
            _pegjs_dist_grammar_js__WEBPACK_IMPORTED_MODULE_0__.parse(input, options);
        }
        catch (e) {
            options.data = -1;
        }
        return options.data;
    }
    Grammar.parse = parse;
    /**
     * Parse the given string and returns a SIP.NameAddrHeader instance or undefined if
     * it is an invalid NameAddrHeader.
     * @param name_addr_header -
     */
    function nameAddrHeaderParse(nameAddrHeader) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedNameAddrHeader = Grammar.parse(nameAddrHeader, "Name_Addr_Header");
        return parsedNameAddrHeader !== -1 ? parsedNameAddrHeader : undefined;
    }
    Grammar.nameAddrHeaderParse = nameAddrHeaderParse;
    /**
     * Parse the given string and returns a SIP.URI instance or undefined if
     * it is an invalid URI.
     * @param uri -
     */
    function URIParse(uri) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedUri = Grammar.parse(uri, "SIP_URI");
        return parsedUri !== -1 ? parsedUri : undefined;
    }
    Grammar.URIParse = URIParse;
})(Grammar = Grammar || (Grammar = {}));


/***/ }),

/***/ "./node_modules/sip.js/lib/grammar/name-addr-header.js":
/*!*************************************************************!*\
  !*** ./node_modules/sip.js/lib/grammar/name-addr-header.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NameAddrHeader: () => (/* binding */ NameAddrHeader)
/* harmony export */ });
/* harmony import */ var _parameters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parameters.js */ "./node_modules/sip.js/lib/grammar/parameters.js");

/**
 * Name Address SIP header.
 * @public
 */
class NameAddrHeader extends _parameters_js__WEBPACK_IMPORTED_MODULE_0__.Parameters {
    /**
     * Constructor
     * @param uri -
     * @param displayName -
     * @param parameters -
     */
    constructor(uri, displayName, parameters) {
        super(parameters);
        this.uri = uri;
        this._displayName = displayName;
    }
    get friendlyName() {
        return this.displayName || this.uri.aor;
    }
    get displayName() { return this._displayName; }
    set displayName(value) {
        this._displayName = value;
    }
    clone() {
        return new NameAddrHeader(this.uri.clone(), this._displayName, JSON.parse(JSON.stringify(this.parameters)));
    }
    toString() {
        let body = (this.displayName || this.displayName === "0") ? '"' + this.displayName + '" ' : "";
        body += "<" + this.uri.toString() + ">";
        for (const parameter in this.parameters) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.parameters.hasOwnProperty(parameter)) {
                body += ";" + parameter;
                if (this.parameters[parameter] !== null) {
                    body += "=" + this.parameters[parameter];
                }
            }
        }
        return body;
    }
}


/***/ }),

/***/ "./node_modules/sip.js/lib/grammar/parameters.js":
/*!*******************************************************!*\
  !*** ./node_modules/sip.js/lib/grammar/parameters.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Parameters: () => (/* binding */ Parameters)
/* harmony export */ });
/**
 * @internal
 */
class Parameters {
    constructor(parameters) {
        this.parameters = {};
        // for in is required here as the Grammar parser is adding to the prototype chain
        for (const param in parameters) {
            // eslint-disable-next-line no-prototype-builtins
            if (parameters.hasOwnProperty(param)) {
                this.setParam(param, parameters[param]);
            }
        }
    }
    setParam(key, value) {
        if (key) {
            this.parameters[key.toLowerCase()] = (typeof value === "undefined" || value === null) ? null : value.toString();
        }
    }
    getParam(key) {
        if (key) {
            return this.parameters[key.toLowerCase()];
        }
    }
    hasParam(key) {
        return !!(key && this.parameters[key.toLowerCase()] !== undefined);
    }
    deleteParam(key) {
        key = key.toLowerCase();
        if (this.hasParam(key)) {
            const value = this.parameters[key];
            delete this.parameters[key];
            return value;
        }
    }
    clearParams() {
        this.parameters = {};
    }
}


/***/ }),

/***/ "./node_modules/sip.js/lib/grammar/pegjs/dist/grammar.js":
/*!***************************************************************!*\
  !*** ./node_modules/sip.js/lib/grammar/pegjs/dist/grammar.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SyntaxError: () => (/* binding */ SyntaxError),
/* harmony export */   parse: () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../name-addr-header.js */ "./node_modules/sip.js/lib/grammar/name-addr-header.js");
/* harmony import */ var _uri_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../uri.js */ "./node_modules/sip.js/lib/grammar/uri.js");


function peg$padEnd(str, targetLength, padString) {
    padString = padString || ' ';
    if (str.length > targetLength) {
        return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
}
class SyntaxError extends Error {
    constructor(message, expected, found, location) {
        super();
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Object.setPrototypeOf === "function") {
            Object.setPrototypeOf(this, SyntaxError.prototype);
        }
        else {
            this.__proto__ = SyntaxError.prototype;
        }
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, SyntaxError);
        }
    }
    static buildMessage(expected, found) {
        function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        }
        function literalEscape(s) {
            return s
                .replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/\0/g, "\\0")
                .replace(/\t/g, "\\t")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
                .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch));
        }
        function classEscape(s) {
            return s
                .replace(/\\/g, "\\\\")
                .replace(/\]/g, "\\]")
                .replace(/\^/g, "\\^")
                .replace(/-/g, "\\-")
                .replace(/\0/g, "\\0")
                .replace(/\t/g, "\\t")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
                .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch));
        }
        function describeExpectation(expectation) {
            switch (expectation.type) {
                case "literal":
                    return "\"" + literalEscape(expectation.text) + "\"";
                case "class":
                    const escapedParts = expectation.parts.map((part) => {
                        return Array.isArray(part)
                            ? classEscape(part[0]) + "-" + classEscape(part[1])
                            : classEscape(part);
                    });
                    return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
                case "any":
                    return "any character";
                case "end":
                    return "end of input";
                case "other":
                    return expectation.description;
            }
        }
        function describeExpected(expected1) {
            const descriptions = expected1.map(describeExpectation);
            let i;
            let j;
            descriptions.sort();
            if (descriptions.length > 0) {
                for (i = 1, j = 1; i < descriptions.length; i++) {
                    if (descriptions[i - 1] !== descriptions[i]) {
                        descriptions[j] = descriptions[i];
                        j++;
                    }
                }
                descriptions.length = j;
            }
            switch (descriptions.length) {
                case 1:
                    return descriptions[0];
                case 2:
                    return descriptions[0] + " or " + descriptions[1];
                default:
                    return descriptions.slice(0, -1).join(", ")
                        + ", or "
                        + descriptions[descriptions.length - 1];
            }
        }
        function describeFound(found1) {
            return found1 ? "\"" + literalEscape(found1) + "\"" : "end of input";
        }
        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    }
    format(sources) {
        let str = 'Error: ' + this.message;
        if (this.location) {
            let src = null;
            let k;
            for (k = 0; k < sources.length; k++) {
                if (sources[k].source === this.location.source) {
                    src = sources[k].text.split(/\r\n|\n|\r/g);
                    break;
                }
            }
            let s = this.location.start;
            let loc = this.location.source + ':' + s.line + ':' + s.column;
            if (src) {
                let e = this.location.end;
                let filler = peg$padEnd('', s.line.toString().length, ' ');
                let line = src[s.line - 1];
                let last = s.line === e.line ? e.column : line.length + 1;
                str += '\n --> ' + loc + '\n' + filler + ' |\n' + s.line + ' | ' + line + '\n' + filler + ' | ' +
                    peg$padEnd('', s.column - 1, ' ') +
                    peg$padEnd('', last - s.column, '^');
            }
            else {
                str += '\n at ' + loc;
            }
        }
        return str;
    }
}
function peg$parse(input, options) {
    options = options !== undefined ? options : {};
    const peg$FAILED = {};
    const peg$source = options.grammarSource;
    const peg$startRuleIndices = { Contact: 119, Name_Addr_Header: 156, Record_Route: 176, Request_Response: 81, SIP_URI: 45, Subscription_State: 186, Supported: 191, Require: 182, Via: 194, absoluteURI: 84, Call_ID: 118, Content_Disposition: 130, Content_Length: 135, Content_Type: 136, CSeq: 146, displayName: 122, Event: 149, From: 151, host: 52, Max_Forwards: 154, Min_SE: 213, Proxy_Authenticate: 157, quoted_string: 40, Refer_To: 178, Replaces: 179, Session_Expires: 210, stun_URI: 217, To: 192, turn_URI: 223, uuid: 226, WWW_Authenticate: 209, challenge: 158, sipfrag: 230, Referred_By: 231 };
    let peg$startRuleIndex = 119;
    const peg$consts = [
        "\r\n",
        peg$literalExpectation("\r\n", false),
        /^[0-9]/,
        peg$classExpectation([["0", "9"]], false, false),
        /^[a-zA-Z]/,
        peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
        /^[0-9a-fA-F]/,
        peg$classExpectation([["0", "9"], ["a", "f"], ["A", "F"]], false, false),
        /^[\0-\xFF]/,
        peg$classExpectation([["\0", "\xFF"]], false, false),
        /^["]/,
        peg$classExpectation(["\""], false, false),
        " ",
        peg$literalExpectation(" ", false),
        "\t",
        peg$literalExpectation("\t", false),
        /^[a-zA-Z0-9]/,
        peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
        ";",
        peg$literalExpectation(";", false),
        "/",
        peg$literalExpectation("/", false),
        "?",
        peg$literalExpectation("?", false),
        ":",
        peg$literalExpectation(":", false),
        "@",
        peg$literalExpectation("@", false),
        "&",
        peg$literalExpectation("&", false),
        "=",
        peg$literalExpectation("=", false),
        "+",
        peg$literalExpectation("+", false),
        "$",
        peg$literalExpectation("$", false),
        ",",
        peg$literalExpectation(",", false),
        "-",
        peg$literalExpectation("-", false),
        "_",
        peg$literalExpectation("_", false),
        ".",
        peg$literalExpectation(".", false),
        "!",
        peg$literalExpectation("!", false),
        "~",
        peg$literalExpectation("~", false),
        "*",
        peg$literalExpectation("*", false),
        "'",
        peg$literalExpectation("'", false),
        "(",
        peg$literalExpectation("(", false),
        ")",
        peg$literalExpectation(")", false),
        "%",
        peg$literalExpectation("%", false),
        function () { return " "; },
        function () { return ':'; },
        /^[!-~]/,
        peg$classExpectation([["!", "~"]], false, false),
        /^[\x80-\uFFFF]/,
        peg$classExpectation([["\x80", "\uFFFF"]], false, false),
        /^[\x80-\xBF]/,
        peg$classExpectation([["\x80", "\xBF"]], false, false),
        /^[a-f]/,
        peg$classExpectation([["a", "f"]], false, false),
        "`",
        peg$literalExpectation("`", false),
        "<",
        peg$literalExpectation("<", false),
        ">",
        peg$literalExpectation(">", false),
        "\\",
        peg$literalExpectation("\\", false),
        "[",
        peg$literalExpectation("[", false),
        "]",
        peg$literalExpectation("]", false),
        "{",
        peg$literalExpectation("{", false),
        "}",
        peg$literalExpectation("}", false),
        function () { return "*"; },
        function () { return "/"; },
        function () { return "="; },
        function () { return "("; },
        function () { return ")"; },
        function () { return ">"; },
        function () { return "<"; },
        function () { return ","; },
        function () { return ";"; },
        function () { return ":"; },
        function () { return "\""; },
        /^[!-']/,
        peg$classExpectation([["!", "'"]], false, false),
        /^[*-[]/,
        peg$classExpectation([["*", "["]], false, false),
        /^[\]-~]/,
        peg$classExpectation([["]", "~"]], false, false),
        function (contents) {
            return contents;
        },
        /^[#-[]/,
        peg$classExpectation([["#", "["]], false, false),
        /^[\0-\t]/,
        peg$classExpectation([["\0", "\t"]], false, false),
        /^[\v-\f]/,
        peg$classExpectation([["\v", "\f"]], false, false),
        /^[\x0E-\x7F]/,
        peg$classExpectation([["\x0E", "\x7F"]], false, false),
        function () {
            options = options || { data: {} };
            options.data.uri = new _uri_js__WEBPACK_IMPORTED_MODULE_0__.URI(options.data.scheme, options.data.user, options.data.host, options.data.port);
            delete options.data.scheme;
            delete options.data.user;
            delete options.data.host;
            delete options.data.host_type;
            delete options.data.port;
        },
        function () {
            options = options || { data: {} };
            options.data.uri = new _uri_js__WEBPACK_IMPORTED_MODULE_0__.URI(options.data.scheme, options.data.user, options.data.host, options.data.port, options.data.uri_params, options.data.uri_headers);
            delete options.data.scheme;
            delete options.data.user;
            delete options.data.host;
            delete options.data.host_type;
            delete options.data.port;
            delete options.data.uri_params;
            if (options.startRule === 'SIP_URI') {
                options.data = options.data.uri;
            }
        },
        "sips",
        peg$literalExpectation("sips", true),
        "sip",
        peg$literalExpectation("sip", true),
        function (uri_scheme) {
            options = options || { data: {} };
            options.data.scheme = uri_scheme;
        },
        function () {
            options = options || { data: {} };
            options.data.user = decodeURIComponent(text().slice(0, -1));
        },
        function () {
            options = options || { data: {} };
            options.data.password = text();
        },
        function () {
            options = options || { data: {} };
            options.data.host = text();
            return options.data.host;
        },
        function () {
            options = options || { data: {} };
            options.data.host_type = 'domain';
            return text();
        },
        /^[a-zA-Z0-9_\-]/,
        peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "-"], false, false),
        /^[a-zA-Z0-9\-]/,
        peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "-"], false, false),
        function () {
            options = options || { data: {} };
            options.data.host_type = 'IPv6';
            return text();
        },
        "::",
        peg$literalExpectation("::", false),
        function () {
            options = options || { data: {} };
            options.data.host_type = 'IPv6';
            return text();
        },
        function () {
            options = options || { data: {} };
            options.data.host_type = 'IPv4';
            return text();
        },
        "25",
        peg$literalExpectation("25", false),
        /^[0-5]/,
        peg$classExpectation([["0", "5"]], false, false),
        "2",
        peg$literalExpectation("2", false),
        /^[0-4]/,
        peg$classExpectation([["0", "4"]], false, false),
        "1",
        peg$literalExpectation("1", false),
        /^[1-9]/,
        peg$classExpectation([["1", "9"]], false, false),
        function (port) {
            options = options || { data: {} };
            port = parseInt(port.join(''));
            options.data.port = port;
            return port;
        },
        "transport=",
        peg$literalExpectation("transport=", true),
        "udp",
        peg$literalExpectation("udp", true),
        "tcp",
        peg$literalExpectation("tcp", true),
        "sctp",
        peg$literalExpectation("sctp", true),
        "tls",
        peg$literalExpectation("tls", true),
        function (transport) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['transport'] = transport.toLowerCase();
        },
        "user=",
        peg$literalExpectation("user=", true),
        "phone",
        peg$literalExpectation("phone", true),
        "ip",
        peg$literalExpectation("ip", true),
        function (user) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['user'] = user.toLowerCase();
        },
        "method=",
        peg$literalExpectation("method=", true),
        function (method) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['method'] = method;
        },
        "ttl=",
        peg$literalExpectation("ttl=", true),
        function (ttl) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            options.data.params['ttl'] = ttl;
        },
        "maddr=",
        peg$literalExpectation("maddr=", true),
        function (maddr) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['maddr'] = maddr;
        },
        "lr",
        peg$literalExpectation("lr", true),
        function () {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['lr'] = undefined;
        },
        function (param, value) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            if (value === null) {
                value = undefined;
            }
            else {
                value = value[1];
            }
            options.data.uri_params[param.toLowerCase()] = value;
        },
        function (hname, hvalue) {
            hname = hname.join('').toLowerCase();
            hvalue = hvalue.join('');
            options = options || { data: {} };
            if (!options.data.uri_headers)
                options.data.uri_headers = {};
            if (!options.data.uri_headers[hname]) {
                options.data.uri_headers[hname] = [hvalue];
            }
            else {
                options.data.uri_headers[hname].push(hvalue);
            }
        },
        function () {
            options = options || { data: {} };
            // lots of tests fail if this isn't guarded...
            if (options.startRule === 'Refer_To') {
                options.data.uri = new _uri_js__WEBPACK_IMPORTED_MODULE_0__.URI(options.data.scheme, options.data.user, options.data.host, options.data.port, options.data.uri_params, options.data.uri_headers);
                delete options.data.scheme;
                delete options.data.user;
                delete options.data.host;
                delete options.data.host_type;
                delete options.data.port;
                delete options.data.uri_params;
            }
        },
        "//",
        peg$literalExpectation("//", false),
        function () {
            options = options || { data: {} };
            options.data.scheme = text();
        },
        peg$literalExpectation("SIP", true),
        function () {
            options = options || { data: {} };
            options.data.sip_version = text();
        },
        "INVITE",
        peg$literalExpectation("INVITE", false),
        "ACK",
        peg$literalExpectation("ACK", false),
        "VXACH",
        peg$literalExpectation("VXACH", false),
        "OPTIONS",
        peg$literalExpectation("OPTIONS", false),
        "BYE",
        peg$literalExpectation("BYE", false),
        "CANCEL",
        peg$literalExpectation("CANCEL", false),
        "REGISTER",
        peg$literalExpectation("REGISTER", false),
        "SUBSCRIBE",
        peg$literalExpectation("SUBSCRIBE", false),
        "NOTIFY",
        peg$literalExpectation("NOTIFY", false),
        "REFER",
        peg$literalExpectation("REFER", false),
        "PUBLISH",
        peg$literalExpectation("PUBLISH", false),
        function () {
            options = options || { data: {} };
            options.data.method = text();
            return options.data.method;
        },
        function (status_code) {
            options = options || { data: {} };
            options.data.status_code = parseInt(status_code.join(''));
        },
        function () {
            options = options || { data: {} };
            options.data.reason_phrase = text();
        },
        function () {
            options = options || { data: {} };
            options.data = text();
        },
        function () {
            var idx, length;
            options = options || { data: {} };
            length = options.data.multi_header.length;
            for (idx = 0; idx < length; idx++) {
                if (options.data.multi_header[idx].parsed === null) {
                    options.data = null;
                    break;
                }
            }
            if (options.data !== null) {
                options.data = options.data.multi_header;
            }
            else {
                options.data = -1;
            }
        },
        function () {
            var header;
            options = options || { data: {} };
            if (!options.data.multi_header)
                options.data.multi_header = [];
            try {
                header = new _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
                delete options.data.uri;
                delete options.data.displayName;
                delete options.data.params;
            }
            catch (e) {
                header = null;
            }
            options.data.multi_header.push({ 'position': peg$currPos,
                'offset': location().start.offset,
                'parsed': header
            });
        },
        function (displayName) {
            displayName = text().trim();
            if (displayName[0] === '\"') {
                displayName = displayName.substring(1, displayName.length - 1);
            }
            options = options || { data: {} };
            options.data.displayName = displayName;
        },
        "q",
        peg$literalExpectation("q", true),
        function (q) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            options.data.params['q'] = q;
        },
        "expires",
        peg$literalExpectation("expires", true),
        function (expires) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            options.data.params['expires'] = expires;
        },
        function (delta_seconds) {
            return parseInt(delta_seconds.join(''));
        },
        "0",
        peg$literalExpectation("0", false),
        function () {
            return parseFloat(text());
        },
        function (param, value) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            if (value === null) {
                value = undefined;
            }
            else {
                value = value[1];
            }
            options.data.params[param.toLowerCase()] = value;
        },
        "render",
        peg$literalExpectation("render", true),
        "session",
        peg$literalExpectation("session", true),
        "icon",
        peg$literalExpectation("icon", true),
        "alert",
        peg$literalExpectation("alert", true),
        function () {
            options = options || { data: {} };
            if (options.startRule === 'Content_Disposition') {
                options.data.type = text().toLowerCase();
            }
        },
        "handling",
        peg$literalExpectation("handling", true),
        "optional",
        peg$literalExpectation("optional", true),
        "required",
        peg$literalExpectation("required", true),
        function (length) {
            options = options || { data: {} };
            options.data = parseInt(length.join(''));
        },
        function () {
            options = options || { data: {} };
            options.data = text();
        },
        "text",
        peg$literalExpectation("text", true),
        "image",
        peg$literalExpectation("image", true),
        "audio",
        peg$literalExpectation("audio", true),
        "video",
        peg$literalExpectation("video", true),
        "application",
        peg$literalExpectation("application", true),
        "message",
        peg$literalExpectation("message", true),
        "multipart",
        peg$literalExpectation("multipart", true),
        "x-",
        peg$literalExpectation("x-", true),
        function (cseq_value) {
            options = options || { data: {} };
            options.data.value = parseInt(cseq_value.join(''));
        },
        function (expires) { options = options || { data: {} }; options.data = expires; },
        function (event_type) {
            options = options || { data: {} };
            options.data.event = event_type.toLowerCase();
        },
        function () {
            options = options || { data: {} };
            var tag = options.data.tag;
            options.data = new _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
            if (tag) {
                options.data.setParam('tag', tag);
            }
        },
        "tag",
        peg$literalExpectation("tag", true),
        function (tag) { options = options || { data: {} }; options.data.tag = tag; },
        function (forwards) {
            options = options || { data: {} };
            options.data = parseInt(forwards.join(''));
        },
        function (min_expires) { options = options || { data: {} }; options.data = min_expires; },
        function () {
            options = options || { data: {} };
            options.data = new _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
        },
        "digest",
        peg$literalExpectation("Digest", true),
        "realm",
        peg$literalExpectation("realm", true),
        function (realm) { options = options || { data: {} }; options.data.realm = realm; },
        "domain",
        peg$literalExpectation("domain", true),
        "nonce",
        peg$literalExpectation("nonce", true),
        function (nonce) { options = options || { data: {} }; options.data.nonce = nonce; },
        "opaque",
        peg$literalExpectation("opaque", true),
        function (opaque) { options = options || { data: {} }; options.data.opaque = opaque; },
        "stale",
        peg$literalExpectation("stale", true),
        "true",
        peg$literalExpectation("true", true),
        function () { options = options || { data: {} }; options.data.stale = true; },
        "false",
        peg$literalExpectation("false", true),
        function () { options = options || { data: {} }; options.data.stale = false; },
        "algorithm",
        peg$literalExpectation("algorithm", true),
        "md5",
        peg$literalExpectation("MD5", true),
        "md5-sess",
        peg$literalExpectation("MD5-sess", true),
        function (algorithm) {
            options = options || { data: {} };
            options.data.algorithm = algorithm.toUpperCase();
        },
        "qop",
        peg$literalExpectation("qop", true),
        "auth-int",
        peg$literalExpectation("auth-int", true),
        "auth",
        peg$literalExpectation("auth", true),
        function (qop_value) {
            options = options || { data: {} };
            options.data.qop || (options.data.qop = []);
            options.data.qop.push(qop_value.toLowerCase());
        },
        function (rack_value) {
            options = options || { data: {} };
            options.data.value = parseInt(rack_value.join(''));
        },
        function () {
            var idx, length;
            options = options || { data: {} };
            length = options.data.multi_header.length;
            for (idx = 0; idx < length; idx++) {
                if (options.data.multi_header[idx].parsed === null) {
                    options.data = null;
                    break;
                }
            }
            if (options.data !== null) {
                options.data = options.data.multi_header;
            }
            else {
                options.data = -1;
            }
        },
        function () {
            var header;
            options = options || { data: {} };
            if (!options.data.multi_header)
                options.data.multi_header = [];
            try {
                header = new _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
                delete options.data.uri;
                delete options.data.displayName;
                delete options.data.params;
            }
            catch (e) {
                header = null;
            }
            options.data.multi_header.push({ 'position': peg$currPos,
                'offset': location().start.offset,
                'parsed': header
            });
        },
        function () {
            options = options || { data: {} };
            options.data = new _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
        },
        function () {
            options = options || { data: {} };
            if (!(options.data.replaces_from_tag && options.data.replaces_to_tag)) {
                options.data = -1;
            }
        },
        function () {
            options = options || { data: {} };
            options.data = {
                call_id: options.data
            };
        },
        "from-tag",
        peg$literalExpectation("from-tag", true),
        function (from_tag) {
            options = options || { data: {} };
            options.data.replaces_from_tag = from_tag;
        },
        "to-tag",
        peg$literalExpectation("to-tag", true),
        function (to_tag) {
            options = options || { data: {} };
            options.data.replaces_to_tag = to_tag;
        },
        "early-only",
        peg$literalExpectation("early-only", true),
        function () {
            options = options || { data: {} };
            options.data.early_only = true;
        },
        function (head, r) { return r; },
        function (head, tail) { return list(head, tail); },
        function (value) {
            options = options || { data: {} };
            if (options.startRule === 'Require') {
                options.data = value || [];
            }
        },
        function (rseq_value) {
            options = options || { data: {} };
            options.data.value = parseInt(rseq_value.join(''));
        },
        "active",
        peg$literalExpectation("active", true),
        "pending",
        peg$literalExpectation("pending", true),
        "terminated",
        peg$literalExpectation("terminated", true),
        function () {
            options = options || { data: {} };
            options.data.state = text();
        },
        "reason",
        peg$literalExpectation("reason", true),
        function (reason) {
            options = options || { data: {} };
            if (typeof reason !== 'undefined')
                options.data.reason = reason;
        },
        function (expires) {
            options = options || { data: {} };
            if (typeof expires !== 'undefined')
                options.data.expires = expires;
        },
        "retry_after",
        peg$literalExpectation("retry_after", true),
        function (retry_after) {
            options = options || { data: {} };
            if (typeof retry_after !== 'undefined')
                options.data.retry_after = retry_after;
        },
        "deactivated",
        peg$literalExpectation("deactivated", true),
        "probation",
        peg$literalExpectation("probation", true),
        "rejected",
        peg$literalExpectation("rejected", true),
        "timeout",
        peg$literalExpectation("timeout", true),
        "giveup",
        peg$literalExpectation("giveup", true),
        "noresource",
        peg$literalExpectation("noresource", true),
        "invariant",
        peg$literalExpectation("invariant", true),
        function (value) {
            options = options || { data: {} };
            if (options.startRule === 'Supported') {
                options.data = value || [];
            }
        },
        function () {
            options = options || { data: {} };
            var tag = options.data.tag;
            options.data = new _name_addr_header_js__WEBPACK_IMPORTED_MODULE_1__.NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
            if (tag) {
                options.data.setParam('tag', tag);
            }
        },
        "ttl",
        peg$literalExpectation("ttl", true),
        function (via_ttl_value) {
            options = options || { data: {} };
            options.data.ttl = via_ttl_value;
        },
        "maddr",
        peg$literalExpectation("maddr", true),
        function (via_maddr) {
            options = options || { data: {} };
            options.data.maddr = via_maddr;
        },
        "received",
        peg$literalExpectation("received", true),
        function (via_received) {
            options = options || { data: {} };
            options.data.received = via_received;
        },
        "branch",
        peg$literalExpectation("branch", true),
        function (via_branch) {
            options = options || { data: {} };
            options.data.branch = via_branch;
        },
        "rport",
        peg$literalExpectation("rport", true),
        function (response_port) {
            options = options || { data: {} };
            if (typeof response_port !== 'undefined')
                options.data.rport = response_port.join('');
        },
        function (via_protocol) {
            options = options || { data: {} };
            options.data.protocol = via_protocol;
        },
        peg$literalExpectation("UDP", true),
        peg$literalExpectation("TCP", true),
        peg$literalExpectation("TLS", true),
        peg$literalExpectation("SCTP", true),
        function (via_transport) {
            options = options || { data: {} };
            options.data.transport = via_transport;
        },
        function () {
            options = options || { data: {} };
            options.data.host = text();
        },
        function (via_sent_by_port) {
            options = options || { data: {} };
            options.data.port = parseInt(via_sent_by_port.join(''));
        },
        function (ttl) {
            return parseInt(ttl.join(''));
        },
        function (deltaSeconds) {
            options = options || { data: {} };
            if (options.startRule === 'Session_Expires') {
                options.data.deltaSeconds = deltaSeconds;
            }
        },
        "refresher",
        peg$literalExpectation("refresher", false),
        "uas",
        peg$literalExpectation("uas", false),
        "uac",
        peg$literalExpectation("uac", false),
        function (endpoint) {
            options = options || { data: {} };
            if (options.startRule === 'Session_Expires') {
                options.data.refresher = endpoint;
            }
        },
        function (deltaSeconds) {
            options = options || { data: {} };
            if (options.startRule === 'Min_SE') {
                options.data = deltaSeconds;
            }
        },
        "stuns",
        peg$literalExpectation("stuns", true),
        "stun",
        peg$literalExpectation("stun", true),
        function (scheme) {
            options = options || { data: {} };
            options.data.scheme = scheme;
        },
        function (host) {
            options = options || { data: {} };
            options.data.host = host;
        },
        "?transport=",
        peg$literalExpectation("?transport=", false),
        "turns",
        peg$literalExpectation("turns", true),
        "turn",
        peg$literalExpectation("turn", true),
        function (transport) {
            options = options || { data: {} };
            options.data.transport = transport;
        },
        function () {
            options = options || { data: {} };
            options.data = text();
        },
        "Referred-By",
        peg$literalExpectation("Referred-By", false),
        "b",
        peg$literalExpectation("b", false),
        "cid",
        peg$literalExpectation("cid", false)
    ];
    const peg$bytecode = [
        peg$decode("2 \"\"6 7!"),
        peg$decode("4\"\"\"5!7#"),
        peg$decode("4$\"\"5!7%"),
        peg$decode("4&\"\"5!7'"),
        peg$decode(";'.# &;("),
        peg$decode("4(\"\"5!7)"),
        peg$decode("4*\"\"5!7+"),
        peg$decode("2,\"\"6,7-"),
        peg$decode("2.\"\"6.7/"),
        peg$decode("40\"\"5!71"),
        peg$decode("22\"\"6273.\x89 &24\"\"6475.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
        peg$decode(";).# &;,"),
        peg$decode("2F\"\"6F7G.} &2H\"\"6H7I.q &2J\"\"6J7K.e &2L\"\"6L7M.Y &2N\"\"6N7O.M &2P\"\"6P7Q.A &2R\"\"6R7S.5 &2T\"\"6T7U.) &2V\"\"6V7W"),
        peg$decode("%%2X\"\"6X7Y/5#;#/,$;#/#$+#)(#'#(\"'#&'#/\"!&,)"),
        peg$decode("%%$;$0#*;$&/,#; /#$+\")(\"'#&'#.\" &\"/=#$;$/&#0#*;$&&&#/'$8\":Z\" )(\"'#&'#"),
        peg$decode(";..\" &\""),
        peg$decode("%$;'.# &;(0)*;'.# &;(&/?#28\"\"6879/0$;//'$8#:[# )(#'#(\"'#&'#"),
        peg$decode("%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+\")(\"'#&'#0=*%$;.0#*;.&/,#;2/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("4\\\"\"5!7].# &;3"),
        peg$decode("4^\"\"5!7_"),
        peg$decode("4`\"\"5!7a"),
        peg$decode(";!.) &4b\"\"5!7c"),
        peg$decode("%$;).\x95 &2F\"\"6F7G.\x89 &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/\x9E#0\x9B*;).\x95 &2F\"\"6F7G.\x89 &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),
        peg$decode("%$;).\x89 &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/\x92#0\x8F*;).\x89 &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),
        peg$decode("2T\"\"6T7U.\xE3 &2V\"\"6V7W.\xD7 &2f\"\"6f7g.\xCB &2h\"\"6h7i.\xBF &2:\"\"6:7;.\xB3 &2D\"\"6D7E.\xA7 &22\"\"6273.\x9B &28\"\"6879.\x8F &2j\"\"6j7k.\x83 &;&.} &24\"\"6475.q &2l\"\"6l7m.e &2n\"\"6n7o.Y &26\"\"6677.M &2>\"\"6>7?.A &2p\"\"6p7q.5 &2r\"\"6r7s.) &;'.# &;("),
        peg$decode("%$;).\u012B &2F\"\"6F7G.\u011F &2J\"\"6J7K.\u0113 &2L\"\"6L7M.\u0107 &2X\"\"6X7Y.\xFB &2P\"\"6P7Q.\xEF &2H\"\"6H7I.\xE3 &2@\"\"6@7A.\xD7 &2d\"\"6d7e.\xCB &2R\"\"6R7S.\xBF &2N\"\"6N7O.\xB3 &2T\"\"6T7U.\xA7 &2V\"\"6V7W.\x9B &2f\"\"6f7g.\x8F &2h\"\"6h7i.\x83 &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s/\u0134#0\u0131*;).\u012B &2F\"\"6F7G.\u011F &2J\"\"6J7K.\u0113 &2L\"\"6L7M.\u0107 &2X\"\"6X7Y.\xFB &2P\"\"6P7Q.\xEF &2H\"\"6H7I.\xE3 &2@\"\"6@7A.\xD7 &2d\"\"6d7e.\xCB &2R\"\"6R7S.\xBF &2N\"\"6N7O.\xB3 &2T\"\"6T7U.\xA7 &2V\"\"6V7W.\x9B &2f\"\"6f7g.\x8F &2h\"\"6h7i.\x83 &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s&&&#/\"!&,)"),
        peg$decode("%;//?#2P\"\"6P7Q/0$;//'$8#:t# )(#'#(\"'#&'#"),
        peg$decode("%;//?#24\"\"6475/0$;//'$8#:u# )(#'#(\"'#&'#"),
        peg$decode("%;//?#2>\"\"6>7?/0$;//'$8#:v# )(#'#(\"'#&'#"),
        peg$decode("%;//?#2T\"\"6T7U/0$;//'$8#:w# )(#'#(\"'#&'#"),
        peg$decode("%;//?#2V\"\"6V7W/0$;//'$8#:x# )(#'#(\"'#&'#"),
        peg$decode("%2h\"\"6h7i/0#;//'$8\":y\" )(\"'#&'#"),
        peg$decode("%;//6#2f\"\"6f7g/'$8\":z\" )(\"'#&'#"),
        peg$decode("%;//?#2D\"\"6D7E/0$;//'$8#:{# )(#'#(\"'#&'#"),
        peg$decode("%;//?#22\"\"6273/0$;//'$8#:|# )(#'#(\"'#&'#"),
        peg$decode("%;//?#28\"\"6879/0$;//'$8#:}# )(#'#(\"'#&'#"),
        peg$decode("%;//0#;&/'$8\":~\" )(\"'#&'#"),
        peg$decode("%;&/0#;//'$8\":~\" )(\"'#&'#"),
        peg$decode("%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#(\"'#&'#"),
        peg$decode("4\x7F\"\"5!7\x80.A &4\x81\"\"5!7\x82.5 &4\x83\"\"5!7\x84.) &;3.# &;."),
        peg$decode("%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#(\"'#&'#/\"!&,)"),
        peg$decode("%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/\"!&,)/1$;&/($8$:\x85$!!)($'#(#'#(\"'#&'#"),
        peg$decode(";..G &2L\"\"6L7M.; &4\x86\"\"5!7\x87./ &4\x83\"\"5!7\x84.# &;3"),
        peg$decode("%2j\"\"6j7k/J#4\x88\"\"5!7\x89.5 &4\x8A\"\"5!7\x8B.) &4\x8C\"\"5!7\x8D/#$+\")(\"'#&'#"),
        peg$decode("%;N/M#28\"\"6879/>$;O.\" &\"/0$;S/'$8$:\x8E$ )($'#(#'#(\"'#&'#"),
        peg$decode("%;N/d#28\"\"6879/U$;O.\" &\"/G$;S/>$;_/5$;l.\" &\"/'$8&:\x8F& )(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%3\x90\"\"5$7\x91.) &3\x92\"\"5#7\x93/' 8!:\x94!! )"),
        peg$decode("%;P/]#%28\"\"6879/,#;R/#$+\")(\"'#&'#.\" &\"/6$2:\"\"6:7;/'$8#:\x95# )(#'#(\"'#&'#"),
        peg$decode("$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#"),
        peg$decode("2<\"\"6<7=.q &2>\"\"6>7?.e &2@\"\"6@7A.Y &2B\"\"6B7C.M &2D\"\"6D7E.A &22\"\"6273.5 &26\"\"6677.) &24\"\"6475"),
        peg$decode("%$;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E0e*;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E&/& 8!:\x96! )"),
        peg$decode("%;T/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%;U.) &;\\.# &;X/& 8!:\x97! )"),
        peg$decode("%$%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#0<*%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#&/D#;W/;$2J\"\"6J7K.\" &\"/'$8#:\x98# )(#'#(\"'#&'#"),
        peg$decode("$4\x99\"\"5!7\x9A/,#0)*4\x99\"\"5!7\x9A&&&#"),
        peg$decode("%4$\"\"5!7%/?#$4\x9B\"\"5!7\x9C0)*4\x9B\"\"5!7\x9C&/#$+\")(\"'#&'#"),
        peg$decode("%2l\"\"6l7m/?#;Y/6$2n\"\"6n7o/'$8#:\x9D# )(#'#(\"'#&'#"),
        peg$decode("%%;Z/\xB3#28\"\"6879/\xA4$;Z/\x9B$28\"\"6879/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+-)(-'#(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0790 &%2\x9E\"\"6\x9E7\x9F/\xA4#;Z/\x9B$28\"\"6879/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u06F9 &%2\x9E\"\"6\x9E7\x9F/\x8C#;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u067A &%2\x9E\"\"6\x9E7\x9F/t#;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0613 &%2\x9E\"\"6\x9E7\x9F/\\#;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+&)(&'#(%'#($'#(#'#(\"'#&'#.\u05C4 &%2\x9E\"\"6\x9E7\x9F/D#;Z/;$28\"\"6879/,$;[/#$+$)($'#(#'#(\"'#&'#.\u058D &%2\x9E\"\"6\x9E7\x9F/,#;[/#$+\")(\"'#&'#.\u056E &%2\x9E\"\"6\x9E7\x9F/,#;Z/#$+\")(\"'#&'#.\u054F &%;Z/\x9B#2\x9E\"\"6\x9E7\x9F/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u04C7 &%;Z/\xAA#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x83$2\x9E\"\"6\x9E7\x9F/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0430 &%;Z/\xB9#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x92$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/k$2\x9E\"\"6\x9E7\x9F/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+))()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u038A &%;Z/\xC8#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xA1$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/z$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/S$2\x9E\"\"6\x9E7\x9F/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u02D5 &%;Z/\xD7#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xB0$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x89$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\x9E\"\"6\x9E7\x9F/,$;[/#$+')(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0211 &%;Z/\xFE#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xD7$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xB0$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x89$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\x9E\"\"6\x9E7\x9F/,$;Z/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0126 &%;Z/\u011C#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xF5$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xCE$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xA7$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x80$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/Y$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/2$2\x9E\"\"6\x9E7\x9F/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/& 8!:\xA0! )"),
        peg$decode("%;#/M#;#.\" &\"/?$;#.\" &\"/1$;#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;Z/;#28\"\"6879/,$;Z/#$+#)(#'#(\"'#&'#.# &;\\"),
        peg$decode("%;]/o#2J\"\"6J7K/`$;]/W$2J\"\"6J7K/H$;]/?$2J\"\"6J7K/0$;]/'$8':\xA1' )(''#(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%2\xA2\"\"6\xA27\xA3/2#4\xA4\"\"5!7\xA5/#$+\")(\"'#&'#.\x98 &%2\xA6\"\"6\xA67\xA7/;#4\xA8\"\"5!7\xA9/,$;!/#$+#)(#'#(\"'#&'#.j &%2\xAA\"\"6\xAA7\xAB/5#;!/,$;!/#$+#)(#'#(\"'#&'#.B &%4\xAC\"\"5!7\xAD/,#;!/#$+\")(\"'#&'#.# &;!"),
        peg$decode("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:\xAE!! )"),
        peg$decode("$%22\"\"6273/,#;`/#$+\")(\"'#&'#0<*%22\"\"6273/,#;`/#$+\")(\"'#&'#&"),
        peg$decode(";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g"),
        peg$decode("%3\xAF\"\"5*7\xB0/a#3\xB1\"\"5#7\xB2.G &3\xB3\"\"5#7\xB4.; &3\xB5\"\"5$7\xB6./ &3\xB7\"\"5#7\xB8.# &;6/($8\":\xB9\"! )(\"'#&'#"),
        peg$decode("%3\xBA\"\"5%7\xBB/I#3\xBC\"\"5%7\xBD./ &3\xBE\"\"5\"7\xBF.# &;6/($8\":\xC0\"! )(\"'#&'#"),
        peg$decode("%3\xC1\"\"5'7\xC2/1#;\x90/($8\":\xC3\"! )(\"'#&'#"),
        peg$decode("%3\xC4\"\"5$7\xC5/1#;\xF0/($8\":\xC6\"! )(\"'#&'#"),
        peg$decode("%3\xC7\"\"5&7\xC8/1#;T/($8\":\xC9\"! )(\"'#&'#"),
        peg$decode("%3\xCA\"\"5\"7\xCB/N#%2>\"\"6>7?/,#;6/#$+\")(\"'#&'#.\" &\"/'$8\":\xCC\" )(\"'#&'#"),
        peg$decode("%;h/P#%2>\"\"6>7?/,#;i/#$+\")(\"'#&'#.\" &\"/)$8\":\xCD\"\"! )(\"'#&'#"),
        peg$decode("%$;j/&#0#*;j&&&#/\"!&,)"),
        peg$decode("%$;j/&#0#*;j&&&#/\"!&,)"),
        peg$decode(";k.) &;+.# &;-"),
        peg$decode("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &28\"\"6879.A &2<\"\"6<7=.5 &2@\"\"6@7A.) &2B\"\"6B7C"),
        peg$decode("%26\"\"6677/n#;m/e$$%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#0<*%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#&/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;n/A#2>\"\"6>7?/2$;o/)$8#:\xCE#\"\" )(#'#(\"'#&'#"),
        peg$decode("$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#"),
        peg$decode("$;p.) &;+.# &;-0/*;p.) &;+.# &;-&"),
        peg$decode("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &26\"\"6677.A &28\"\"6879.5 &2@\"\"6@7A.) &2B\"\"6B7C"),
        peg$decode(";\x91.# &;r"),
        peg$decode("%;\x90/G#;'/>$;s/5$;'/,$;\x84/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode(";M.# &;t"),
        peg$decode("%;\x7F/E#28\"\"6879/6$;u.# &;x/'$8#:\xCF# )(#'#(\"'#&'#"),
        peg$decode("%;v.# &;w/J#%26\"\"6677/,#;\x83/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%2\xD0\"\"6\xD07\xD1/:#;\x80/1$;w.\" &\"/#$+#)(#'#(\"'#&'#"),
        peg$decode("%24\"\"6475/,#;{/#$+\")(\"'#&'#"),
        peg$decode("%;z/3#$;y0#*;y&/#$+\")(\"'#&'#"),
        peg$decode(";*.) &;+.# &;-"),
        peg$decode(";+.\x8F &;-.\x89 &22\"\"6273.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
        peg$decode("%;|/e#$%24\"\"6475/,#;|/#$+\")(\"'#&'#0<*%24\"\"6475/,#;|/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%$;~0#*;~&/e#$%22\"\"6273/,#;}/#$+\")(\"'#&'#0<*%22\"\"6273/,#;}/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("$;~0#*;~&"),
        peg$decode(";+.w &;-.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
        peg$decode("%%;\"/\x87#$;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K0M*;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K&/#$+\")(\"'#&'#/& 8!:\xD2! )"),
        peg$decode(";\x81.# &;\x82"),
        peg$decode("%%;O/2#2:\"\"6:7;/#$+\")(\"'#&'#.\" &\"/,#;S/#$+\")(\"'#&'#.\" &\""),
        peg$decode("$;+.\x83 &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A/\x8C#0\x89*;+.\x83 &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A&&&#"),
        peg$decode("$;y0#*;y&"),
        peg$decode("%3\x92\"\"5#7\xD3/q#24\"\"6475/b$$;!/&#0#*;!&&&#/L$2J\"\"6J7K/=$$;!/&#0#*;!&&&#/'$8%:\xD4% )(%'#($'#(#'#(\"'#&'#"),
        peg$decode("2\xD5\"\"6\xD57\xD6"),
        peg$decode("2\xD7\"\"6\xD77\xD8"),
        peg$decode("2\xD9\"\"6\xD97\xDA"),
        peg$decode("2\xDB\"\"6\xDB7\xDC"),
        peg$decode("2\xDD\"\"6\xDD7\xDE"),
        peg$decode("2\xDF\"\"6\xDF7\xE0"),
        peg$decode("2\xE1\"\"6\xE17\xE2"),
        peg$decode("2\xE3\"\"6\xE37\xE4"),
        peg$decode("2\xE5\"\"6\xE57\xE6"),
        peg$decode("2\xE7\"\"6\xE77\xE8"),
        peg$decode("2\xE9\"\"6\xE97\xEA"),
        peg$decode("%;\x85.Y &;\x86.S &;\x88.M &;\x89.G &;\x8A.A &;\x8B.; &;\x8C.5 &;\x8F./ &;\x8D.) &;\x8E.# &;6/& 8!:\xEB! )"),
        peg$decode("%;\x84/G#;'/>$;\x92/5$;'/,$;\x94/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;\x93/' 8!:\xEC!! )"),
        peg$decode("%;!/5#;!/,$;!/#$+#)(#'#(\"'#&'#"),
        peg$decode("%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:\xED! )"),
        peg$decode("%;\xB6/Y#$%;A/,#;\xB6/#$+\")(\"'#&'#06*%;A/,#;\xB6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;9/N#%2:\"\"6:7;/,#;9/#$+\")(\"'#&'#.\" &\"/'$8\":\xEE\" )(\"'#&'#"),
        peg$decode("%;:.c &%;\x98/Y#$%;A/,#;\x98/#$+\")(\"'#&'#06*%;A/,#;\x98/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/& 8!:\xEF! )"),
        peg$decode("%;L.# &;\x99/]#$%;B/,#;\x9B/#$+\")(\"'#&'#06*%;B/,#;\x9B/#$+\")(\"'#&'#&/'$8\":\xF0\" )(\"'#&'#"),
        peg$decode("%;\x9A.\" &\"/>#;@/5$;M/,$;?/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%%;6/Y#$%;./,#;6/#$+\")(\"'#&'#06*%;./,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#.# &;H/' 8!:\xF1!! )"),
        peg$decode(";\x9C.) &;\x9D.# &;\xA0"),
        peg$decode("%3\xF2\"\"5!7\xF3/:#;</1$;\x9F/($8#:\xF4#! )(#'#(\"'#&'#"),
        peg$decode("%3\xF5\"\"5'7\xF6/:#;</1$;\x9E/($8#:\xF7#! )(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\xF8!! )"),
        peg$decode("%2\xF9\"\"6\xF97\xFA/o#%2J\"\"6J7K/M#;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+$)($'#(#'#(\"'#&'#.\" &\"/'$8\":\xFB\" )(\"'#&'#"),
        peg$decode("%;6/J#%;</,#;\xA1/#$+\")(\"'#&'#.\" &\"/)$8\":\xFC\"\"! )(\"'#&'#"),
        peg$decode(";6.) &;T.# &;H"),
        peg$decode("%;\xA3/Y#$%;B/,#;\xA4/#$+\")(\"'#&'#06*%;B/,#;\xA4/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%3\xFD\"\"5&7\xFE.G &3\xFF\"\"5'7\u0100.; &3\u0101\"\"5$7\u0102./ &3\u0103\"\"5%7\u0104.# &;6/& 8!:\u0105! )"),
        peg$decode(";\xA5.# &;\xA0"),
        peg$decode("%3\u0106\"\"5(7\u0107/M#;</D$3\u0108\"\"5(7\u0109./ &3\u010A\"\"5(7\u010B.# &;6/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u010C!! )"),
        peg$decode("%;\xA9/& 8!:\u010D! )"),
        peg$decode("%;\xAA/k#;;/b$;\xAF/Y$$%;B/,#;\xB0/#$+\")(\"'#&'#06*%;B/,#;\xB0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode(";\xAB.# &;\xAC"),
        peg$decode("3\u010E\"\"5$7\u010F.S &3\u0110\"\"5%7\u0111.G &3\u0112\"\"5%7\u0113.; &3\u0114\"\"5%7\u0115./ &3\u0116\"\"5+7\u0117.# &;\xAD"),
        peg$decode("3\u0118\"\"5'7\u0119./ &3\u011A\"\"5)7\u011B.# &;\xAD"),
        peg$decode(";6.# &;\xAE"),
        peg$decode("%3\u011C\"\"5\"7\u011D/,#;6/#$+\")(\"'#&'#"),
        peg$decode(";\xAD.# &;6"),
        peg$decode("%;6/5#;</,$;\xB1/#$+#)(#'#(\"'#&'#"),
        peg$decode(";6.# &;H"),
        peg$decode("%;\xB3/5#;./,$;\x90/#$+#)(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u011E!! )"),
        peg$decode("%;\x9E/' 8!:\u011F!! )"),
        peg$decode("%;\xB6/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":\u0120\"!!)(\"'#&'#"),
        peg$decode("%%;7/e#$%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#0<*%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;L.# &;\x99/]#$%;B/,#;\xB8/#$+\")(\"'#&'#06*%;B/,#;\xB8/#$+\")(\"'#&'#&/'$8\":\u0121\" )(\"'#&'#"),
        peg$decode(";\xB9.# &;\xA0"),
        peg$decode("%3\u0122\"\"5#7\u0123/:#;</1$;6/($8#:\u0124#! )(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u0125!! )"),
        peg$decode("%;\x9E/' 8!:\u0126!! )"),
        peg$decode("%$;\x9A0#*;\x9A&/x#;@/o$;M/f$;?/]$$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8%:\u0127% )(%'#($'#(#'#(\"'#&'#"),
        peg$decode(";\xBE"),
        peg$decode("%3\u0128\"\"5&7\u0129/k#;./b$;\xC1/Y$$%;A/,#;\xC1/#$+\")(\"'#&'#06*%;A/,#;\xC1/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#.# &;\xBF"),
        peg$decode("%;6/k#;./b$;\xC0/Y$$%;A/,#;\xC0/#$+\")(\"'#&'#06*%;A/,#;\xC0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;6/;#;</2$;6.# &;H/#$+#)(#'#(\"'#&'#"),
        peg$decode(";\xC2.G &;\xC4.A &;\xC6.; &;\xC8.5 &;\xC9./ &;\xCA.) &;\xCB.# &;\xC0"),
        peg$decode("%3\u012A\"\"5%7\u012B/5#;</,$;\xC3/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;I/' 8!:\u012C!! )"),
        peg$decode("%3\u012D\"\"5&7\u012E/\x97#;</\x8E$;D/\x85$;\xC5/|$$%$;'/&#0#*;'&&&#/,#;\xC5/#$+\")(\"'#&'#0C*%$;'/&#0#*;'&&&#/,#;\xC5/#$+\")(\"'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode(";t.# &;w"),
        peg$decode("%3\u012F\"\"5%7\u0130/5#;</,$;\xC7/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;I/' 8!:\u0131!! )"),
        peg$decode("%3\u0132\"\"5&7\u0133/:#;</1$;I/($8#:\u0134#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0135\"\"5%7\u0136/]#;</T$%3\u0137\"\"5$7\u0138/& 8!:\u0139! ).4 &%3\u013A\"\"5%7\u013B/& 8!:\u013C! )/#$+#)(#'#(\"'#&'#"),
        peg$decode("%3\u013D\"\"5)7\u013E/R#;</I$3\u013F\"\"5#7\u0140./ &3\u0141\"\"5(7\u0142.# &;6/($8#:\u0143#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0144\"\"5#7\u0145/\x93#;</\x8A$;D/\x81$%;\xCC/e#$%2D\"\"6D7E/,#;\xCC/#$+\")(\"'#&'#0<*%2D\"\"6D7E/,#;\xCC/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%3\u0146\"\"5(7\u0147./ &3\u0148\"\"5$7\u0149.# &;6/' 8!:\u014A!! )"),
        peg$decode("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;\xCF/G#;./>$;\xCF/5$;./,$;\x90/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u014B!! )"),
        peg$decode("%;\xD1/]#$%;A/,#;\xD1/#$+\")(\"'#&'#06*%;A/,#;\xD1/#$+\")(\"'#&'#&/'$8\":\u014C\" )(\"'#&'#"),
        peg$decode("%;\x99/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":\u014D\" )(\"'#&'#"),
        peg$decode("%;L.O &;\x99.I &%;@.\" &\"/:#;t/1$;?.\" &\"/#$+#)(#'#(\"'#&'#/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":\u014E\" )(\"'#&'#"),
        peg$decode("%;\xD4/]#$%;B/,#;\xD5/#$+\")(\"'#&'#06*%;B/,#;\xD5/#$+\")(\"'#&'#&/'$8\":\u014F\" )(\"'#&'#"),
        peg$decode("%;\x96/& 8!:\u0150! )"),
        peg$decode("%3\u0151\"\"5(7\u0152/:#;</1$;6/($8#:\u0153#! )(#'#(\"'#&'#.g &%3\u0154\"\"5&7\u0155/:#;</1$;6/($8#:\u0156#! )(#'#(\"'#&'#.: &%3\u0157\"\"5*7\u0158/& 8!:\u0159! ).# &;\xA0"),
        peg$decode("%%;6/k#$%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#&/)$8\":\u015B\"\"! )(\"'#&'#.\" &\"/' 8!:\u015C!! )"),
        peg$decode("%;\xD8/Y#$%;A/,#;\xD8/#$+\")(\"'#&'#06*%;A/,#;\xD8/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;\x99/Y#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u015D!! )"),
        peg$decode("%;\xDB/Y#$%;B/,#;\xDC/#$+\")(\"'#&'#06*%;B/,#;\xDC/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%3\u015E\"\"5&7\u015F.; &3\u0160\"\"5'7\u0161./ &3\u0162\"\"5*7\u0163.# &;6/& 8!:\u0164! )"),
        peg$decode("%3\u0165\"\"5&7\u0166/:#;</1$;\xDD/($8#:\u0167#! )(#'#(\"'#&'#.} &%3\xF5\"\"5'7\xF6/:#;</1$;\x9E/($8#:\u0168#! )(#'#(\"'#&'#.P &%3\u0169\"\"5+7\u016A/:#;</1$;\x9E/($8#:\u016B#! )(#'#(\"'#&'#.# &;\xA0"),
        peg$decode("3\u016C\"\"5+7\u016D.k &3\u016E\"\"5)7\u016F._ &3\u0170\"\"5(7\u0171.S &3\u0172\"\"5'7\u0173.G &3\u0174\"\"5&7\u0175.; &3\u0176\"\"5*7\u0177./ &3\u0178\"\"5)7\u0179.# &;6"),
        peg$decode(";1.\" &\""),
        peg$decode("%%;6/k#$%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#&/)$8\":\u015B\"\"! )(\"'#&'#.\" &\"/' 8!:\u017A!! )"),
        peg$decode("%;L.# &;\x99/]#$%;B/,#;\xE1/#$+\")(\"'#&'#06*%;B/,#;\xE1/#$+\")(\"'#&'#&/'$8\":\u017B\" )(\"'#&'#"),
        peg$decode(";\xB9.# &;\xA0"),
        peg$decode("%;\xE3/Y#$%;A/,#;\xE3/#$+\")(\"'#&'#06*%;A/,#;\xE3/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;\xEA/k#;./b$;\xED/Y$$%;B/,#;\xE4/#$+\")(\"'#&'#06*%;B/,#;\xE4/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode(";\xE5.; &;\xE6.5 &;\xE7./ &;\xE8.) &;\xE9.# &;\xA0"),
        peg$decode("%3\u017C\"\"5#7\u017D/:#;</1$;\xF0/($8#:\u017E#! )(#'#(\"'#&'#"),
        peg$decode("%3\u017F\"\"5%7\u0180/:#;</1$;T/($8#:\u0181#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0182\"\"5(7\u0183/F#;</=$;\\.) &;Y.# &;X/($8#:\u0184#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0185\"\"5&7\u0186/:#;</1$;6/($8#:\u0187#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0188\"\"5%7\u0189/A#;</8$$;!0#*;!&/($8#:\u018A#! )(#'#(\"'#&'#"),
        peg$decode("%;\xEB/G#;;/>$;6/5$;;/,$;\xEC/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%3\x92\"\"5#7\xD3.# &;6/' 8!:\u018B!! )"),
        peg$decode("%3\xB1\"\"5#7\u018C.G &3\xB3\"\"5#7\u018D.; &3\xB7\"\"5#7\u018E./ &3\xB5\"\"5$7\u018F.# &;6/' 8!:\u0190!! )"),
        peg$decode("%;\xEE/D#%;C/,#;\xEF/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%;U.) &;\\.# &;X/& 8!:\u0191! )"),
        peg$decode("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:\u0192!! )"),
        peg$decode("%%;!/?#;!.\" &\"/1$;!.\" &\"/#$+#)(#'#(\"'#&'#/' 8!:\u0193!! )"),
        peg$decode(";\xBE"),
        peg$decode("%;\x9E/^#$%;B/,#;\xF3/#$+\")(\"'#&'#06*%;B/,#;\xF3/#$+\")(\"'#&'#&/($8\":\u0194\"!!)(\"'#&'#"),
        peg$decode(";\xF4.# &;\xA0"),
        peg$decode("%2\u0195\"\"6\u01957\u0196/L#;</C$2\u0197\"\"6\u01977\u0198.) &2\u0199\"\"6\u01997\u019A/($8#:\u019B#! )(#'#(\"'#&'#"),
        peg$decode("%;\x9E/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":\u019C\"!!)(\"'#&'#"),
        peg$decode("%;6/5#;0/,$;\xF7/#$+#)(#'#(\"'#&'#"),
        peg$decode("$;2.) &;4.# &;.0/*;2.) &;4.# &;.&"),
        peg$decode("$;%0#*;%&"),
        peg$decode("%;\xFA/;#28\"\"6879/,$;\xFB/#$+#)(#'#(\"'#&'#"),
        peg$decode("%3\u019D\"\"5%7\u019E.) &3\u019F\"\"5$7\u01A0/' 8!:\u01A1!! )"),
        peg$decode("%;\xFC/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%;\\.) &;X.# &;\x82/' 8!:\u01A2!! )"),
        peg$decode(";\".S &;!.M &2F\"\"6F7G.A &2J\"\"6J7K.5 &2H\"\"6H7I.) &2N\"\"6N7O"),
        peg$decode("2L\"\"6L7M.\x95 &2B\"\"6B7C.\x89 &2<\"\"6<7=.} &2R\"\"6R7S.q &2T\"\"6T7U.e &2V\"\"6V7W.Y &2P\"\"6P7Q.M &2@\"\"6@7A.A &2D\"\"6D7E.5 &22\"\"6273.) &2>\"\"6>7?"),
        peg$decode("%;\u0100/b#28\"\"6879/S$;\xFB/J$%2\u01A3\"\"6\u01A37\u01A4/,#;\xEC/#$+\")(\"'#&'#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%3\u01A5\"\"5%7\u01A6.) &3\u01A7\"\"5$7\u01A8/' 8!:\u01A1!! )"),
        peg$decode("%3\xB1\"\"5#7\xB2.6 &3\xB3\"\"5#7\xB4.* &$;+0#*;+&/' 8!:\u01A9!! )"),
        peg$decode("%;\u0104/\x87#2F\"\"6F7G/x$;\u0103/o$2F\"\"6F7G/`$;\u0103/W$2F\"\"6F7G/H$;\u0103/?$2F\"\"6F7G/0$;\u0105/'$8):\u01AA) )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;\u0103/,#;\u0103/#$+\")(\"'#&'#"),
        peg$decode("%;\u0103/5#;\u0103/,$;\u0103/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;q/T#$;m0#*;m&/D$%; /,#;\xF8/#$+\")(\"'#&'#.\" &\"/#$+#)(#'#(\"'#&'#"),
        peg$decode("%2\u01AB\"\"6\u01AB7\u01AC.) &2\u01AD\"\"6\u01AD7\u01AE/w#;0/n$;\u0108/e$$%;B/2#;\u0109.# &;\xA0/#$+\")(\"'#&'#0<*%;B/2#;\u0109.# &;\xA0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode(";\x99.# &;L"),
        peg$decode("%2\u01AF\"\"6\u01AF7\u01B0/5#;</,$;\u010A/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;D/S#;,/J$2:\"\"6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#")
    ];
    let peg$currPos = 0;
    let peg$savedPos = 0;
    const peg$posDetailsCache = [{ line: 1, column: 1 }];
    let peg$maxFailPos = 0;
    let peg$maxFailExpected = [];
    let peg$silentFails = 0;
    let peg$result;
    if (options.startRule !== undefined) {
        if (!(options.startRule in peg$startRuleIndices)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }
    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }
    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function expected(description, location1) {
        location1 = location1 !== undefined
            ? location1
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location1);
    }
    function error(message, location1) {
        location1 = location1 !== undefined
            ? location1
            : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location1);
    }
    function peg$literalExpectation(text1, ignoreCase) {
        return { type: "literal", text: text1, ignoreCase: ignoreCase };
    }
    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }
    function peg$anyExpectation() {
        return { type: "any" };
    }
    function peg$endExpectation() {
        return { type: "end" };
    }
    function peg$otherExpectation(description) {
        return { type: "other", description: description };
    }
    function peg$computePosDetails(pos) {
        let details = peg$posDetailsCache[pos];
        let p;
        if (details) {
            return details;
        }
        else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }
            details = peg$posDetailsCache[p];
            details = {
                line: details.line,
                column: details.column
            };
            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                }
                else {
                    details.column++;
                }
                p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
        }
    }
    function peg$computeLocation(startPos, endPos) {
        const startPosDetails = peg$computePosDetails(startPos);
        const endPosDetails = peg$computePosDetails(endPos);
        return {
            source: peg$source,
            start: {
                offset: startPos,
                line: startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line: endPosDetails.line,
                column: endPosDetails.column
            }
        };
    }
    function peg$fail(expected1) {
        if (peg$currPos < peg$maxFailPos) {
            return;
        }
        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected1);
    }
    function peg$buildSimpleError(message, location1) {
        return new SyntaxError(message, [], "", location1);
    }
    function peg$buildStructuredError(expected1, found, location1) {
        return new SyntaxError(SyntaxError.buildMessage(expected1, found), expected1, found, location1);
    }
    function peg$decode(s) {
        return s.split("").map((ch) => ch.charCodeAt(0) - 32);
    }
    function peg$parseRule(index) {
        const bc = peg$bytecode[index];
        let ip = 0;
        const ips = [];
        let end = bc.length;
        const ends = [];
        const stack = [];
        let params;
        while (true) {
            while (ip < end) {
                switch (bc[ip]) {
                    case 0:
                        stack.push(peg$consts[bc[ip + 1]]);
                        ip += 2;
                        break;
                    case 1:
                        stack.push(undefined);
                        ip++;
                        break;
                    case 2:
                        stack.push(null);
                        ip++;
                        break;
                    case 3:
                        stack.push(peg$FAILED);
                        ip++;
                        break;
                    case 4:
                        stack.push([]);
                        ip++;
                        break;
                    case 5:
                        stack.push(peg$currPos);
                        ip++;
                        break;
                    case 6:
                        stack.pop();
                        ip++;
                        break;
                    case 7:
                        peg$currPos = stack.pop();
                        ip++;
                        break;
                    case 8:
                        stack.length -= bc[ip + 1];
                        ip += 2;
                        break;
                    case 9:
                        stack.splice(-2, 1);
                        ip++;
                        break;
                    case 10:
                        stack[stack.length - 2].push(stack.pop());
                        ip++;
                        break;
                    case 11:
                        stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
                        ip += 2;
                        break;
                    case 12:
                        stack.push(input.substring(stack.pop(), peg$currPos));
                        ip++;
                        break;
                    case 13:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (stack[stack.length - 1]) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 14:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (stack[stack.length - 1] === peg$FAILED) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 15:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (stack[stack.length - 1] !== peg$FAILED) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 16:
                        if (stack[stack.length - 1] !== peg$FAILED) {
                            ends.push(end);
                            ips.push(ip);
                            end = ip + 2 + bc[ip + 1];
                            ip += 2;
                        }
                        else {
                            ip += 2 + bc[ip + 1];
                        }
                        break;
                    case 17:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (input.length > peg$currPos) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 18:
                        ends.push(end);
                        ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
                        if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                            end = ip + 4 + bc[ip + 2];
                            ip += 4;
                        }
                        else {
                            end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                            ip += 4 + bc[ip + 2];
                        }
                        break;
                    case 19:
                        ends.push(end);
                        ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
                        if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                            end = ip + 4 + bc[ip + 2];
                            ip += 4;
                        }
                        else {
                            end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                            ip += 4 + bc[ip + 2];
                        }
                        break;
                    case 20:
                        ends.push(end);
                        ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
                        if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                            end = ip + 4 + bc[ip + 2];
                            ip += 4;
                        }
                        else {
                            end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                            ip += 4 + bc[ip + 2];
                        }
                        break;
                    case 21:
                        stack.push(input.substr(peg$currPos, bc[ip + 1]));
                        peg$currPos += bc[ip + 1];
                        ip += 2;
                        break;
                    case 22:
                        stack.push(peg$consts[bc[ip + 1]]);
                        peg$currPos += peg$consts[bc[ip + 1]].length;
                        ip += 2;
                        break;
                    case 23:
                        stack.push(peg$FAILED);
                        if (peg$silentFails === 0) {
                            peg$fail(peg$consts[bc[ip + 1]]);
                        }
                        ip += 2;
                        break;
                    case 24:
                        peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
                        ip += 2;
                        break;
                    case 25:
                        peg$savedPos = peg$currPos;
                        ip++;
                        break;
                    case 26:
                        params = bc.slice(ip + 4, ip + 4 + bc[ip + 3])
                            .map(function (p) { return stack[stack.length - 1 - p]; });
                        stack.splice(stack.length - bc[ip + 2], bc[ip + 2], peg$consts[bc[ip + 1]].apply(null, params));
                        ip += 4 + bc[ip + 3];
                        break;
                    case 27:
                        stack.push(peg$parseRule(bc[ip + 1]));
                        ip += 2;
                        break;
                    case 28:
                        peg$silentFails++;
                        ip++;
                        break;
                    case 29:
                        peg$silentFails--;
                        ip++;
                        break;
                    default:
                        throw new Error("Invalid opcode: " + bc[ip] + ".");
                }
            }
            if (ends.length > 0) {
                end = ends.pop();
                ip = ips.pop();
            }
            else {
                break;
            }
        }
        return stack[0];
    }
    options.data = {}; // Object to which header attributes will be assigned during parsing
    function list(head, tail) {
        return [head].concat(tail);
    }
    peg$result = peg$parseRule(peg$startRuleIndex);
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    }
    else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
}
const parse = peg$parse;


/***/ }),

/***/ "./node_modules/sip.js/lib/grammar/uri.js":
/*!************************************************!*\
  !*** ./node_modules/sip.js/lib/grammar/uri.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   URI: () => (/* binding */ URI),
/* harmony export */   equivalentURI: () => (/* binding */ equivalentURI)
/* harmony export */ });
/* harmony import */ var _parameters_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parameters.js */ "./node_modules/sip.js/lib/grammar/parameters.js");
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * URI.
 * @public
 */
class URI extends _parameters_js__WEBPACK_IMPORTED_MODULE_0__.Parameters {
    /**
     * Constructor
     * @param scheme -
     * @param user -
     * @param host -
     * @param port -
     * @param parameters -
     * @param headers -
     */
    constructor(scheme = "sip", user, host, port, parameters, headers) {
        super(parameters || {});
        this.headers = {};
        // Checks
        if (!host) {
            throw new TypeError('missing or invalid "host" parameter');
        }
        for (const header in headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (headers.hasOwnProperty(header)) {
                this.setHeader(header, headers[header]);
            }
        }
        // Raw URI
        this.raw = {
            scheme,
            user,
            host,
            port
        };
        // Normalized URI
        this.normal = {
            scheme: scheme.toLowerCase(),
            user,
            host: host.toLowerCase(),
            port
        };
    }
    get scheme() { return this.normal.scheme; }
    set scheme(value) {
        this.raw.scheme = value;
        this.normal.scheme = value.toLowerCase();
    }
    get user() { return this.normal.user; }
    set user(value) {
        this.normal.user = this.raw.user = value;
    }
    get host() { return this.normal.host; }
    set host(value) {
        this.raw.host = value;
        this.normal.host = value.toLowerCase();
    }
    get aor() { return this.normal.user + "@" + this.normal.host; }
    get port() { return this.normal.port; }
    set port(value) {
        this.normal.port = this.raw.port = value === 0 ? value : value;
    }
    setHeader(name, value) {
        this.headers[this.headerize(name)] = (value instanceof Array) ? value : [value];
    }
    getHeader(name) {
        if (name) {
            return this.headers[this.headerize(name)];
        }
    }
    hasHeader(name) {
        // eslint-disable-next-line no-prototype-builtins
        return !!name && !!this.headers.hasOwnProperty(this.headerize(name));
    }
    deleteHeader(header) {
        header = this.headerize(header);
        // eslint-disable-next-line no-prototype-builtins
        if (this.headers.hasOwnProperty(header)) {
            const value = this.headers[header];
            delete this.headers[header];
            return value;
        }
    }
    clearHeaders() {
        this.headers = {};
    }
    clone() {
        return new URI(this._raw.scheme, this._raw.user || "", this._raw.host, this._raw.port, JSON.parse(JSON.stringify(this.parameters)), JSON.parse(JSON.stringify(this.headers)));
    }
    toRaw() {
        return this._toString(this._raw);
    }
    toString() {
        return this._toString(this._normal);
    }
    get _normal() { return this.normal; }
    get _raw() { return this.raw; }
    _toString(uri) {
        let uriString = uri.scheme + ":";
        // add slashes if it's not a sip(s) URI
        if (!uri.scheme.toLowerCase().match("^sips?$")) {
            uriString += "//";
        }
        if (uri.user) {
            uriString += this.escapeUser(uri.user) + "@";
        }
        uriString += uri.host;
        if (uri.port || uri.port === 0) {
            uriString += ":" + uri.port;
        }
        for (const parameter in this.parameters) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.parameters.hasOwnProperty(parameter)) {
                uriString += ";" + parameter;
                if (this.parameters[parameter] !== null) {
                    uriString += "=" + this.parameters[parameter];
                }
            }
        }
        const headers = [];
        for (const header in this.headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.headers.hasOwnProperty(header)) {
                // eslint-disable-next-line @typescript-eslint/no-for-in-array
                for (const idx in this.headers[header]) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (this.headers[header].hasOwnProperty(idx)) {
                        headers.push(header + "=" + this.headers[header][idx]);
                    }
                }
            }
        }
        if (headers.length > 0) {
            uriString += "?" + headers.join("&");
        }
        return uriString;
    }
    /*
     * Hex-escape a SIP URI user.
     * @private
     * @param {String} user
     */
    escapeUser(user) {
        let decodedUser;
        // FIXME: This is called by toString above which should never throw, but
        // decodeURIComponent can throw and I've seen one case in production where
        // it did throw resulting in a cascading failure. This class should be
        // fixed so that decodeURIComponent is not called at this point (in toString).
        // The user should be decoded when the URI is constructor or some other
        // place where we can catch the error before the URI is created or somesuch.
        // eslint-disable-next-line no-useless-catch
        try {
            decodedUser = decodeURIComponent(user);
        }
        catch (error) {
            throw error;
        }
        // Don't hex-escape ':' (%3A), '+' (%2B), '?' (%3F"), '/' (%2F).
        return encodeURIComponent(decodedUser)
            .replace(/%3A/ig, ":")
            .replace(/%2B/ig, "+")
            .replace(/%3F/ig, "?")
            .replace(/%2F/ig, "/");
    }
    headerize(str) {
        const exceptions = {
            "Call-Id": "Call-ID",
            "Cseq": "CSeq",
            "Min-Se": "Min-SE",
            "Rack": "RAck",
            "Rseq": "RSeq",
            "Www-Authenticate": "WWW-Authenticate",
        };
        const name = str.toLowerCase().replace(/_/g, "-").split("-");
        const parts = name.length;
        let hname = "";
        for (let part = 0; part < parts; part++) {
            if (part !== 0) {
                hname += "-";
            }
            hname += name[part].charAt(0).toUpperCase() + name[part].substring(1);
        }
        if (exceptions[hname]) {
            hname = exceptions[hname];
        }
        return hname;
    }
}
/**
 * Returns true if URIs are equivalent per RFC 3261 Section 19.1.4.
 * @param a - URI to compare
 * @param b - URI to compare
 *
 * @remarks
 * 19.1.4 URI Comparison
 * Some operations in this specification require determining whether two
 * SIP or SIPS URIs are equivalent.
 *
 * https://tools.ietf.org/html/rfc3261#section-19.1.4
 * @internal
 */
function equivalentURI(a, b) {
    // o  A SIP and SIPS URI are never equivalent.
    if (a.scheme !== b.scheme) {
        return false;
    }
    // o  Comparison of the userinfo of SIP and SIPS URIs is case-
    //    sensitive.  This includes userinfo containing passwords or
    //    formatted as telephone-subscribers.  Comparison of all other
    //    components of the URI is case-insensitive unless explicitly
    //    defined otherwise.
    //
    // o  The ordering of parameters and header fields is not significant
    //    in comparing SIP and SIPS URIs.
    //
    // o  Characters other than those in the "reserved" set (see RFC 2396
    //    [5]) are equivalent to their ""%" HEX HEX" encoding.
    //
    // o  An IP address that is the result of a DNS lookup of a host name
    //    does not match that host name.
    //
    // o  For two URIs to be equal, the user, password, host, and port
    //    components must match.
    //
    // A URI omitting the user component will not match a URI that
    // includes one.  A URI omitting the password component will not
    // match a URI that includes one.
    //
    // A URI omitting any component with a default value will not
    // match a URI explicitly containing that component with its
    // default value.  For instance, a URI omitting the optional port
    // component will not match a URI explicitly declaring port 5060.
    // The same is true for the transport-parameter, ttl-parameter,
    // user-parameter, and method components.
    //
    // Defining sip:user@host to not be equivalent to
    // sip:user@host:5060 is a change from RFC 2543.  When deriving
    // addresses from URIs, equivalent addresses are expected from
    // equivalent URIs.  The URI sip:user@host:5060 will always
    // resolve to port 5060.  The URI sip:user@host may resolve to
    // other ports through the DNS SRV mechanisms detailed in [4].
    // FIXME: TODO:
    // - character compared to hex encoding is not handled
    // - password does not exist on URI currently
    if (a.user !== b.user || a.host !== b.host || a.port !== b.port) {
        return false;
    }
    // o  URI uri-parameter components are compared as follows:
    function compareParameters(a, b) {
        //  -  Any uri-parameter appearing in both URIs must match.
        const parameterKeysA = Object.keys(a.parameters);
        const parameterKeysB = Object.keys(b.parameters);
        const intersection = parameterKeysA.filter(x => parameterKeysB.includes(x));
        if (!intersection.every(key => a.parameters[key] === b.parameters[key])) {
            return false;
        }
        //  -  A user, ttl, or method uri-parameter appearing in only one
        //     URI never matches, even if it contains the default value.
        if (!["user", "ttl", "method", "transport"].every(key => a.hasParam(key) && b.hasParam(key) || !a.hasParam(key) && !b.hasParam(key))) {
            return false;
        }
        //  -  A URI that includes an maddr parameter will not match a URI
        //     that contains no maddr parameter.
        if (!["maddr"].every(key => a.hasParam(key) && b.hasParam(key) || !a.hasParam(key) && !b.hasParam(key))) {
            return false;
        }
        //  -  All other uri-parameters appearing in only one URI are
        //     ignored when comparing the URIs.
        return true;
    }
    if (!compareParameters(a, b)) {
        return false;
    }
    // o  URI header components are never ignored.  Any present header
    //    component MUST be present in both URIs and match for the URIs
    //    to match.  The matching rules are defined for each header field
    //    in Section 20.
    const headerKeysA = Object.keys(a.headers);
    const headerKeysB = Object.keys(b.headers);
    // No need to check if no headers
    if (headerKeysA.length !== 0 || headerKeysB.length !== 0) {
        // Must have same number of headers
        if (headerKeysA.length !== headerKeysB.length) {
            return false;
        }
        // Must have same headers
        const intersection = headerKeysA.filter(x => headerKeysB.includes(x));
        if (intersection.length !== headerKeysB.length) {
            return false;
        }
        // FIXME: Not to spec. But perhaps not worth fixing?
        // Must have same header values
        // It seems too much to consider multiple headers with same name.
        // It seems too much to compare two header params according to the rule of each header.
        // We'll assume a single header and compare them string to string...
        if (!intersection.every(key => a.headers[key].length && b.headers[key].length && a.headers[key][0] === b.headers[key][0])) {
            return false;
        }
    }
    return true;
}


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

module.exports = JSON.parse('{"name":"ringcentral-web-phone","version":"1.0.0-beta2","homepage":"https://github.com/ringcentral/ringcentral-web-phone","bugs":{"url":"https://github.com/ringcentral/ringcentral-web-phone/issues"},"repository":{"type":"git","url":"git://github.com/ringcentral/ringcentral-web-phone.git"},"license":"MIT","author":{"name":"RingCentral, Inc.","email":"devsupport@ringcentral.com"},"contributors":[{"name":"Kirill Konshin"},{"name":"Elias Sun"},{"name":"Vyshakh Babji"},{"name":"Yatin Gera"},{"name":"Tyler Liu"},{"name":"Embbnux Ji"}],"main":"./lib/index.js","types":"./lib/index.d.ts","scripts":{"build":"yarn tsc && webpack --progress --color","lint":"eslint --fix \'**/*.{ts,tsx,js,jsx}\' && prettier --write . && sort-package-json","serve":"webpack serve --progress --color","test":"jest","test:coverage":"cat .coverage/lcov.info | coveralls -v"},"dependencies":{"sip.js":"0.21.2"},"devDependencies":{"@faker-js/faker":"8.0.1","@ringcentral/sdk":"4.7.4","@types/jest":"29.5.1","@types/jest-environment-puppeteer":"5.0.3","@types/node":"20.2.3","@typescript-eslint/eslint-plugin":"5.59.7","@typescript-eslint/parser":"5.59.7","buffer":"6.0.3","cache-loader":"4.1.0","copy-webpack-plugin":"11.0.0","coveralls":"3.1.1","crypto-browserify":"3.12.0","dotenv-override-true":"6.2.2","eslint":"8.41.0","eslint-config-alloy":"5.0.0","eslint-config-prettier":"8.8.0","eslint-plugin-jest":"27.2.1","eslint-plugin-prettier":"4.2.1","html-webpack-plugin":"5.5.1","istanbul-instrumenter-loader":"3.0.1","jest":"29.5.0","jest-puppeteer":"8.0.6","jquery":"3.7.0","prettier":"2.8.8","puppeteer":"20.3.0","querystring-es3":"0.2.1","sort-package-json":"2.4.1","stream-browserify":"3.0.0","ts-jest":"29.1.0","ts-loader":"9.4.3","ts-node":"10.9.1","ttpt":"0.6.3","typescript":"5.0.4","wait-for-async":"0.6.1","webpack":"5.83.1","webpack-cli":"5.1.1","webpack-dev-server":"4.15.0","yarn-upgrade-all":"0.7.2"},"engines":{"node":">=16"},"preferGlobal":false}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var sip_js_lib_core_log_levels__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sip.js/lib/core/log/levels */ "./node_modules/sip.js/lib/core/log/levels.js");
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sip.js */ "sip.js");
/* harmony import */ var sip_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sip_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _userAgent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./userAgent */ "./src/userAgent.ts");
/* harmony import */ var _mediaStreams__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mediaStreams */ "./src/mediaStreams.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _sessionDescriptionHandler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sessionDescriptionHandler */ "./src/sessionDescriptionHandler.ts");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../package.json */ "./package.json");








const version = _package_json__WEBPACK_IMPORTED_MODULE_6__.version;
const defaultWebPhoneOptions = {
    autoStop: true,
    builtinEnabled: true,
    earlyMedia: false,
    enableDefaultModifiers: true,
    enableDscp: false,
    iceTransportPolicy: 'all',
    maxReconnectionAttemptsNoBackup: 15,
    maxReconnectionAttemptsWithBackup: 10,
    mediaConstraints: _constants__WEBPACK_IMPORTED_MODULE_4__.defaultMediaConstraints,
    modifiers: [],
    // FIXME: This should be in seconds since every other config is in seconds
    qosCollectInterval: 5000,
    reconnectionTimeoutNoBackup: 5,
    reconnectionTimeoutWithBackup: 4,
    transportServers: [],
    turnServers: [],
    uuid: (0,_utils__WEBPACK_IMPORTED_MODULE_3__.uuid)(),
    uuidKey: _constants__WEBPACK_IMPORTED_MODULE_4__.uuidKey,
};
/**
 * WebPhone class to initiate WebRTC calls
 */
class WebPhone {
    /** WebPhone version */
    static version = version;
    /** Utility function to generate uuid */
    static uuid = _utils__WEBPACK_IMPORTED_MODULE_3__.uuid;
    /** Utility function to extend object */
    static extend = _utils__WEBPACK_IMPORTED_MODULE_3__.extend;
    static MediaStreams = _mediaStreams__WEBPACK_IMPORTED_MODULE_2__["default"];
    static MediaStreamsImpl = _mediaStreams__WEBPACK_IMPORTED_MODULE_2__.MediaStreamsImpl;
    /** Sip Info received from the registration endpoint */
    sipInfo;
    /** Key that will be used to save uuid in localStorage */
    uuidKey;
    /** Name used in user agent string */
    appName;
    /** Version used in user agent string */
    appVersion;
    /** WebPhoneUserAgent instance */
    userAgent;
    /**
     * TODO: include 'WebPhone' for all apps other than Chrome and Glip
     * TODO: parse wsservers from new api spec
     */
    // eslint-disable-next-line complexity
    constructor(registrationData = {}, _options = {}) {
        const options = { ...defaultWebPhoneOptions, ..._options };
        this.sipInfo = registrationData.sipInfo;
        if (Array.isArray(this.sipInfo)) {
            this.sipInfo = this.sipInfo[0];
        }
        this.uuidKey = options.uuidKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;
        const id = options.uuid;
        localStorage.setItem(this.uuidKey, id);
        const uaMatch = navigator.userAgent.match(/\((.*?)\)/);
        const appClientOs = uaMatch === null ? '' : uaMatch[1].replace(/[^a-zA-Z0-9.:_]+/g, '-');
        const userAgentString = (this.appName ? this.appName + (this.appVersion ? '/' + this.appVersion : '') + ' ' : '') +
            (appClientOs ? appClientOs : '') +
            ` RCWEBPHONE/${WebPhone.version}`;
        const modifiers = options.modifiers;
        if (!options.enableDefaultModifiers) {
            modifiers.push(sip_js__WEBPACK_IMPORTED_MODULE_0__.Web.stripG722);
            modifiers.push(sip_js__WEBPACK_IMPORTED_MODULE_0__.Web.stripTcpCandidates);
        }
        if (options.enableMidLinesInSDP) {
            modifiers.push(sip_js__WEBPACK_IMPORTED_MODULE_0__.Web.addMidLines);
        }
        const sdpSemantics = options.enablePlanB ? 'plan-b' : 'unified-plan';
        const stunServers = options.stunServers || _constants__WEBPACK_IMPORTED_MODULE_4__.defaultStunServers;
        const iceTransportPolicy = options.iceTransportPolicy;
        let iceServers = [];
        if (options.enableTurnServers) {
            iceServers = options.turnServers.map((url) => ({ urls: url }));
            options.iceCheckingTimeout = options.iceCheckingTimeout || 2000;
        }
        iceServers = [
            ...iceServers,
            ...stunServers.map((_url) => {
                const url = !/^(stun:)/.test(_url) ? `stun:${_url}` : _url;
                return { urls: url };
            }),
        ];
        const sessionDescriptionHandlerFactoryOptions = options.sessionDescriptionHandlerFactoryOptions || {
            iceGatheringTimeout: options.iceCheckingTimeout || 500,
            enableDscp: options.enableDscp,
            peerConnectionConfiguration: {
                iceServers,
                iceTransportPolicy,
                sdpSemantics,
            },
        };
        sessionDescriptionHandlerFactoryOptions.enableDscp = !!options.enableDscp;
        options.modifiers = modifiers;
        const browserUa = navigator.userAgent.toLowerCase();
        if (browserUa.includes('firefox') && !browserUa.includes('chrome')) {
            // FIXME: alwaysAcquireMediaFirst has been removed from SIP.js. Is it the same as earlyMedia?
            options.earlyMedia = true;
        }
        const sessionDescriptionHandlerFactory = options.sessionDescriptionHandlerFactory || _sessionDescriptionHandler__WEBPACK_IMPORTED_MODULE_5__.defaultSessionDescriptionFactory;
        const sipErrorCodes = registrationData.sipErrorCodes?.length
            ? registrationData.sipErrorCodes
            : _constants__WEBPACK_IMPORTED_MODULE_4__.defaultSipErrorCodes;
        let reconnectionTimeout = options.reconnectionTimeoutWithBackup;
        let maxReconnectionAttempts = options.maxReconnectionAttemptsWithBackup;
        if (this.sipInfo.outboundProxy && this.sipInfo.transport) {
            options.transportServers.push({
                uri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy,
            });
            reconnectionTimeout = options.reconnectionTimeoutNoBackup;
            maxReconnectionAttempts = options.maxReconnectionAttemptsNoBackup;
        }
        if (this.sipInfo.outboundProxyBackup && this.sipInfo.transport) {
            options.transportServers.push({
                uri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxyBackup,
            });
        }
        options.reconnectionTimeout = options.reconnectionTimeout || reconnectionTimeout;
        options.maxReconnectionAttempts = options.maxReconnectionAttempts || maxReconnectionAttempts;
        const transportServer = options.transportServers.length ? options.transportServers[0].uri : '';
        const configuration = {
            uri: sip_js__WEBPACK_IMPORTED_MODULE_0__.UserAgent.makeURI(`sip:${this.sipInfo.username}@${this.sipInfo.domain}`),
            transportOptions: {
                server: transportServer,
                traceSip: true,
                connectionTimeout: 5,
                keepAliveDebounce: options.keepAliveDebounce,
                keepAliveInterval: options.keepAliveInterval,
            },
            // WebPhoneTransport will handle reconnection.
            reconnectionAttempts: 0,
            authorizationUsername: this.sipInfo.authorizationId,
            authorizationPassword: this.sipInfo.password,
            logLevel: sip_js_lib_core_log_levels__WEBPACK_IMPORTED_MODULE_7__.Levels[options.logLevel] || _constants__WEBPACK_IMPORTED_MODULE_4__.defaultLogLevel,
            logBuiltinEnabled: options.builtinEnabled,
            logConnector: options.connector || undefined,
            userAgentString,
            sessionDescriptionHandlerFactoryOptions,
            sessionDescriptionHandlerFactory,
            allowLegacyNotifications: true,
        };
        options.sipErrorCodes = sipErrorCodes;
        options.switchBackInterval = this.sipInfo.switchBackInterval;
        this.userAgent = (0,_userAgent__WEBPACK_IMPORTED_MODULE_1__.createWebPhoneUserAgent)(configuration, this.sipInfo, options, id);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebPhone);

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=ringcentral-web-phone.js.map