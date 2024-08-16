export class AudioHelper {
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
        return this._playSound(this._incoming, value, this.volume ?? 0.5);
    }
    /**
     * Play or pause outgoing feedback
     * @param value `true` to play audio and `false` to pause
     * @returns
     */
    playOutgoing(value) {
        return this._playSound(this._outgoing, value, this.volume ?? 1);
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
