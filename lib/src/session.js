import { EventEmitter } from 'events';
import { RequestPendingError, UserAgent } from 'sip.js';
import { fromBodyLegacy } from 'sip.js/lib/core';
import { SessionState } from 'sip.js/lib/api/session-state';
import { extend } from './utils';
import { responseTimeout, messages } from './constants';
import { MediaStreams } from './mediaStreams';
import { isNoAudio } from './rtpReport';
import { Events } from './events';
import { startQosStatsCollection } from './qos';
export class CommonSession {
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
export function patchWebphoneSession(session) {
    if (session.__patched) {
        return session;
    }
    session.__patched = true;
    session.held = false;
    session.muted = false;
    session.media = session.userAgent.media;
    session.__dispose = session.dispose.bind(session);
    session.dispose = dispose.bind(session);
    const eventEmitter = new EventEmitter();
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
            case SessionState.Establishing: {
                session.emit(Events.Session.Establishing);
                break;
            }
            case SessionState.Established: {
                stopPlaying(session);
                session.addTrack();
                session.emit(Events.Session.Established);
                break;
            }
            case SessionState.Terminating: {
                stopPlaying(session);
                stopMediaStreamStats(session);
                session.emit(Events.Session.Terminating);
                break;
            }
            case SessionState.Terminated: {
                stopPlaying(session);
                session.emit(Events.Session.Terminated);
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
export function patchIncomingWebphoneSession(session) {
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
    extend(options, {
        sid: this.rcHeaders.sid,
        request: this.rcHeaders.request,
        from: this.rcHeaders.to,
        to: this.rcHeaders.from,
    });
    return this.userAgent.createRcMessage(options);
}
async function sendReceiveConfirm() {
    return this.sendSessionMessage(messages.receiveConfirm)
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
    extend(command, options);
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
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                    }, responseTimeout);
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
            body: fromBodyLegacy({
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
        body: fromBodyLegacy({
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
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(messages.ignore));
}
function toVoicemail() {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(messages.toVoicemail));
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
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage({ reqid: messages.replyWithMessage.reqid, body }));
}
async function flip(target) {
    return this.sendInfoAndReceiveResponse(messages.flip, { target });
}
async function whisper() {
    return this.sendInfoAndReceiveResponse(messages.whisper);
}
async function barge() {
    return this.sendInfoAndReceiveResponse(messages.barge);
}
function park() {
    return this.sendInfoAndReceiveResponse(messages.park);
}
function mute(silent) {
    if (this.state !== SessionState.Established) {
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
        this.emit(Events.Session.Muted, this);
    }
}
function unmute(silent) {
    if (this.state !== SessionState.Established) {
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
        this.emit(Events.Session.Unmuted, this);
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
        this.mediaStreams = new MediaStreams(this);
        this.logger.log('Start gathering media report');
        this.mediaStatsStarted = true;
        this.mediaStreams.getMediaStats((report) => {
            if (this.userAgent.enableMediaReportLogging) {
                this.logger.log(`Got media report: ${JSON.stringify(report)}`);
            }
            if (!this.reinviteForNoAudioSent && isNoAudio(report)) {
                this.logger.log('No audio report');
                this.noAudioReportCount++;
                if (this.noAudioReportCount === 3) {
                    this.logger.log('No audio for 6 sec. Trying to recover audio by sending Re-invite');
                    this.mediaStreams.reconnectMedia();
                    this.reinviteForNoAudioSent = true;
                    this.noAudioReportCount = 0;
                }
            }
            else if (!isNoAudio(report)) {
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
    const newTarget = typeof target === 'string' ? UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo.domain}`) : target;
    return this.refer(newTarget, options);
}
async function warmTransfer(target, options = { requestOptions: { extraHeaders: [] } }) {
    options.requestOptions.extraHeaders = (options.requestOptions.extraHeaders || []).concat(this.userAgent.defaultHeaders);
    const newTarget = typeof target === 'string' ? UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo.domain}`) : target;
    this.logger.log('Completing warm transfer');
    return this.refer(newTarget, options);
}
async function transfer(target, options = {}) {
    if (!options.requestOptions) {
        options.requestOptions = {};
    }
    if (!options.requestOptions.extraHeaders) {
        options.requestOptions.extraHeaders = [];
    }
    options.requestOptions.extraHeaders = [...options.requestOptions.extraHeaders, ...this.userAgent.defaultHeaders];
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (e) {
        throw new Error('Unhold could not be completed');
    }
    this.addTrack(this.media.remote, this.media.local);
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
        this.emit(Events.Session.Accepted, this.request);
    }
    catch (e) {
        if (e.message.indexOf('Permission denied') !== -1) {
            this.emit(Events.Session.UserMediaFailed);
        }
    }
}
// eslint-disable-next-line max-params
async function forward(target, acceptOptions = {}, transferOptions = {}) {
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
            extend(session.rcHeaders, {
                srvLvl: bdyNode.getAttribute('SrvLvl'),
                srvLvlExt: bdyNode.getAttribute('SrvLvlExt'),
                nm: bdyNode.getAttribute('Nm'),
                toNm: bdyNode.getAttribute('ToNm'),
            });
        }
    }
    if (prcCallInfo) {
        const parsed = parseRcHeaderString(prcCallInfo);
        extend(session.rcHeaders, parsed);
    }
}
async function setRecord(session, flag) {
    const message = flag ? messages.startRecord : messages.stopRecord;
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
            if (error instanceof RequestPendingError) {
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
export function onSessionDescriptionHandlerCreated(session) {
    if (!session.userAgent.enableQos) {
        return;
    }
    session.logger.log('SessionDescriptionHandler created');
    startQosStatsCollection(session);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => session.logger.log(`${device.kind} = ${device.label} ${JSON.stringify(device)}`));
    });
}
function setupUserAgentCoreEvent(session) {
    if (session.__userAgentCoreEventsSetup) {
        return;
    }
    const userAgentCore = session.userAgent.userAgentCore;
    userAgentCore.on(Events.Session.UpdateReceived, (payload) => session.emit(Events.Session.UpdateReceived, payload));
    userAgentCore.on(Events.Session.MoveToRcv, (payload) => session.emit(Events.Session.MoveToRcv, payload));
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onLocalHold() {
    return this.__localHold;
}
function setQosStats(stats) {
    this.__qosStats.cpuOS = stats.cpuOS || '0:0:0';
    this.__qosStats.cpuRC = stats.cpuRC || '0:0:0';
    this.__qosStats.ram = stats.ram || '0:0:0';
    this.__qosStats.netType = stats.netType || undefined;
}
