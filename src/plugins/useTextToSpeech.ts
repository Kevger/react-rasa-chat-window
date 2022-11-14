import { useEffect, useState } from "react";


export enum TTSState {
    supportError,
    idle,
    loading,
    speaking,
    paused,
}

/**
 * React hook to load, set and use textToSpeech. The available voices depend on the browser and OS.
 * @param  {[number]} initVoice index of the used voice in the voice list. defaults to 0. 
 * @param  {[() => {})]} onEnd callback when tts utterance finishes
 * @param  {[() => {}]} onStart callback when tts utterance starts
 * @return returns a list of available voices (depends on the users os and browser), the index of the current active voice.
 * a setter for the used voice (use the index of the voice list), the textToSpeech function which can be used like that tts("hello world"), 
 * the tts state and functions to pause, resume and cancel the tts.
 */
export default function useTextToSpeech(initVoice: number = 0, onEnd = () => { }, onStart = () => { }) {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [activeVoice, setActiveVoice] = useState(initVoice);
    const [ttsState, setTTSState] = useState<TTSState>(TTSState.loading)

    const loadVoices = () => {
        if (!(window.speechSynthesis)) {
            setTTSState(TTSState.supportError);
            return;
        }
        const synth = window.speechSynthesis;

        const initTTS = (voices: SpeechSynthesisVoice[]) => {
            setVoices(voices);
            setTTSState(TTSState.idle)
        }

        // some browser load the voices asynchronously 
        const newVoices = synth.getVoices();
        if (newVoices.length === 0) {
            synth.onvoiceschanged = () => { }
            return;
        }
        initTTS(newVoices);
    }

    const tts = (text: string, voice = activeVoice, pitch = 1, rate = 1, volume = 1) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = window.speechSynthesis.getVoices()[voice];
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = volume;
        utterance.onend = () => {
            onEnd();
            setTTSState(TTSState.idle);
        }
        utterance.onstart = () => {
            onStart();
            setTTSState(TTSState.speaking);
        }
        window.speechSynthesis.speak(utterance);
    }

    const cancel = () => {
        window.speechSynthesis.cancel();
        setTTSState(TTSState.idle)
    }

    const resume = () => {
        window.speechSynthesis.resume();
        if (!window.speechSynthesis.paused && window.speechSynthesis.speaking) {
            setTTSState(TTSState.speaking);
        }
    }

    const pause = () => {
        window.speechSynthesis.pause();
        setTTSState(TTSState.paused);
    }

    useEffect(loadVoices, []);
    return { ttsState, voices, setActiveVoice, tts, cancel, pause, resume, activeVoice, pending: window.speechSynthesis.pending }
}