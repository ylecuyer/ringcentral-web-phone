import { EventEmitter } from 'events';
import { C } from 'sip.js/lib/core';
import { Events } from './events';
/** @ignore */
export function patchUserAgentCore(userAgent) {
    const userAgentCore = userAgent.userAgentCore;
    const eventEmitter = new EventEmitter();
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
        case C.UPDATE: {
            this.logger.log('Receive UPDATE request. Do nothing just return 200 OK');
            this.replyStateless(message, { statusCode: 200 });
            this.emit(Events.Session.UpdateReceived, message);
            return;
        }
        case C.INFO: {
            // For the Move2RCV request from server
            const content = getIncomingInfoContent(message);
            if (content?.request?.reqId && content?.request?.command === 'move' && content?.request?.target === 'rcv') {
                this.replyStateless(message, { statusCode: 200 });
                this.emit(Events.Session.MoveToRcv, content.request);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (e) {
        return {};
    }
    return ret;
}
