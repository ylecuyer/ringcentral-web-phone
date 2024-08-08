import { EventEmitter } from 'events';
import { UserAgent, UserAgentState, Registerer, RegistererState, Inviter, Messager } from 'sip.js';
import { createWebPhoneTransport } from './transport';
import { AudioHelper } from './audioHelper';
import { Events } from './events';
import { onSessionDescriptionHandlerCreated, patchIncomingWebphoneSession, patchWebphoneSession } from './session';
import { patchUserAgentCore } from './userAgentCore';
/** @ignore */
// eslint-disable-next-line max-params
export function createWebPhoneUserAgent(configuration, sipInfo, options, id) {
    const extraConfiguration = {
        delegate: {
            onConnect: () => userAgent.register(),
            onInvite: (invitation) => {
                userAgent.audioHelper.playIncoming(true);
                invitation.delegate = {};
                invitation.delegate.onSessionDescriptionHandler = () => onSessionDescriptionHandlerCreated(invitation);
                patchWebphoneSession(invitation);
                patchIncomingWebphoneSession(invitation);
                invitation.logger.log('UA received incoming call invite');
                invitation.sendReceiveConfirm();
                userAgent.emit(Events.UserAgent.Invite, invitation);
            },
            onNotify: (notification) => {
                const event = notification.request.getHeader('Event');
                if (event === '') {
                    userAgent.emit(Events.UserAgent.ProvisionUpdate);
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
    const userAgent = new UserAgent(extendedConfiguration);
    const eventEmitter = new EventEmitter();
    userAgent.on = eventEmitter.on.bind(eventEmitter);
    userAgent.off = eventEmitter.off.bind(eventEmitter);
    userAgent.once = eventEmitter.once.bind(eventEmitter);
    userAgent.addListener = eventEmitter.addListener.bind(eventEmitter);
    userAgent.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    userAgent.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
    userAgent.defaultHeaders = [`P-rc-endpoint-id: ${id}`];
    if (typeof options.clientId !== 'undefined') {
        userAgent.defaultHeaders.push(`Client-id: ${options.clientId}`);
    }
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
    userAgent.registerer = new Registerer(userAgent, {
        regId: userAgent.regId,
        instanceId: userAgent.instanceId,
        extraHeaders: userAgent.defaultHeaders,
    });
    userAgent.sipInfo = sipInfo;
    userAgent.modifiers = options.modifiers;
    userAgent.constraints = options.mediaConstraints;
    userAgent.earlyMedia = options.earlyMedia;
    userAgent.audioHelper = new AudioHelper(options.audioHelper);
    userAgent.onSession = options.onSession;
    userAgent._transport = createWebPhoneTransport(userAgent.transport, options);
    userAgent.onTransportDisconnect = onTransportDisconnect.bind(userAgent);
    userAgent.emit = eventEmitter.emit.bind(eventEmitter);
    userAgent.register = register.bind(userAgent);
    userAgent.unregister = unregister.bind(userAgent);
    userAgent.invite = invite.bind(userAgent);
    userAgent.sendMessage = sendMessage.bind(userAgent);
    userAgent.createRcMessage = createRcMessage.bind(userAgent);
    userAgent.switchFrom = switchFrom.bind(userAgent);
    patchUserAgentCore(userAgent);
    userAgent.start();
    userAgent.stateChange.addListener((newState) => {
        switch (newState) {
            case UserAgentState.Started: {
                userAgent.emit(Events.UserAgent.Started);
                break;
            }
            case UserAgentState.Stopped: {
                userAgent.emit(Events.UserAgent.Stopped);
                break;
            }
        }
    });
    userAgent.registerer.stateChange.addListener((newState) => {
        switch (newState) {
            case RegistererState.Registered: {
                userAgent.emit(Events.UserAgent.Registered);
                break;
            }
            case RegistererState.Unregistered: {
                userAgent.emit(Events.UserAgent.Unregistered);
                break;
            }
        }
    });
    return userAgent;
}
function onTransportDisconnect(error) {
    // Patch it so that reconnection is managed by WebPhoneTransport
    if (this.state === UserAgentState.Stopped) {
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
    const uri = UserAgent.makeURI(to);
    uri.user = user;
    const messager = new Messager(this, uri, messageData, 'x-rc/agent', {
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
                this.emit(Events.UserAgent.RegistrationFailed, response);
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
        onSessionDescriptionHandler: () => onSessionDescriptionHandlerCreated(inviter),
        onNotify: (notification) => notification.accept(),
    };
    this.audioHelper.playOutgoing(true);
    this.logger.log(`Invite to ${number} created with playOutgoing set to true`);
    const inviter = new Inviter(this, UserAgent.makeURI(`sip:${number}@${this.sipInfo.domain}`), inviterOptions);
    inviter
        .invite({
        requestDelegate: {
            onAccept: (inviteResponse) => {
                inviter.startTime = new Date();
                inviter.emit(Events.Session.Accepted, inviteResponse.message);
            },
            onProgress: (inviteResponse) => {
                inviter.emit(Events.Session.Progress, inviteResponse.message);
            },
        },
    })
        .then(() => this.emit(Events.UserAgent.InviteSent, inviter))
        .catch((e) => {
        if (e.message.indexOf('Permission denied') > -1) {
            inviter.emit(Events.Session.UserMediaFailed);
        }
        throw e;
    });
    patchWebphoneSession(inviter);
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
