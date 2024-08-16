export interface DomAudio extends HTMLAudioElement {
    playPromise?: Promise<void>;
}
export interface AudioHelperOptions {
    /** Enable audio feedback for incoming and outgoing calls */
    enabled?: boolean;
    /** Path to audio file for incoming call */
    incoming?: string;
    /** Path to audio file for outgoing call */
    outgoing?: string;
}
export declare class AudioHelper {
    /** Current volume */
    volume?: number;
    private readonly _enabled;
    private _incoming?;
    private _outgoing?;
    private _audio?;
    constructor(options?: AudioHelperOptions);
    /** Load incoming and outgoing audio files for feedback */
    loadAudio(options: AudioHelperOptions): void;
    /** Set volume for incoming and outgoing feedback */
    setVolume(_volume: number): void;
    /**
     * Play or pause incoming feedback
     * @param value `true` to play audio and `false` to pause
     * @returns
     */
    playIncoming(value: boolean): AudioHelper;
    /**
     * Play or pause outgoing feedback
     * @param value `true` to play audio and `false` to pause
     * @returns
     */
    playOutgoing(value: boolean): AudioHelper;
    private _playSound;
}
