import { Levels as LogLevels } from 'sip.js/lib/core/log/levels';
import { UserAgent, Web } from 'sip.js';
import { createWebPhoneUserAgent } from './userAgent';
import { default as MediaStreams, MediaStreamsImpl } from './mediaStreams';
import { uuid, extend } from './utils';
import { uuidKey, defaultMediaConstraints, defaultLogLevel, defaultSipErrorCodes, defaultStunServers, } from './constants';
import { defaultSessionDescriptionFactory } from './sessionDescriptionHandler';
import pkg from '../package.json';
const version = pkg.version;
const defaultWebPhoneOptions = {
    autoStop: true,
    builtinEnabled: true,
    earlyMedia: false,
    enableDefaultModifiers: true,
    enableDscp: false,
    iceTransportPolicy: 'all',
    maxReconnectionAttemptsNoBackup: 15,
    maxReconnectionAttemptsWithBackup: 10,
    mediaConstraints: defaultMediaConstraints,
    modifiers: [],
    // FIXME: This should be in seconds since every other config is in seconds
    qosCollectInterval: 5000,
    reconnectionTimeoutNoBackup: 5,
    reconnectionTimeoutWithBackup: 4,
    transportServers: [],
    turnServers: [],
    uuid: uuid(),
    uuidKey,
};
/**
 * WebPhone class to initiate WebRTC calls
 */
export default class WebPhone {
    /** WebPhone version */
    static version = version;
    /** Utility function to generate uuid */
    static uuid = uuid;
    /** Utility function to extend object */
    static extend = extend;
    static MediaStreams = MediaStreams;
    static MediaStreamsImpl = MediaStreamsImpl;
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
            modifiers.push(Web.stripG722);
            modifiers.push(Web.stripTcpCandidates);
        }
        if (options.enableMidLinesInSDP) {
            modifiers.push(Web.addMidLines);
        }
        const sdpSemantics = options.enablePlanB ? 'plan-b' : 'unified-plan';
        const stunServers = options.stunServers || defaultStunServers;
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
        const sessionDescriptionHandlerFactory = options.sessionDescriptionHandlerFactory || defaultSessionDescriptionFactory;
        const sipErrorCodes = registrationData.sipErrorCodes?.length
            ? registrationData.sipErrorCodes
            : defaultSipErrorCodes;
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
            uri: UserAgent.makeURI(`sip:${this.sipInfo.username}@${this.sipInfo.domain}`),
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
            logLevel: LogLevels[options.logLevel] || defaultLogLevel,
            logBuiltinEnabled: options.builtinEnabled,
            logConnector: options.connector || undefined,
            userAgentString,
            sessionDescriptionHandlerFactoryOptions,
            sessionDescriptionHandlerFactory,
            allowLegacyNotifications: true,
        };
        options.sipErrorCodes = sipErrorCodes;
        options.switchBackInterval = this.sipInfo.switchBackInterval;
        this.userAgent = createWebPhoneUserAgent(configuration, this.sipInfo, options, id);
    }
}
