import Header from "./components/Header";
import React, {createRef, useEffect, useRef, useState} from "react";

function App() {

    const tts = window.speechSynthesis;
    const [text, setText] = useState('Lorem Ipsum is simply dummy text of the printing and typesetting industry');
    const [voiceList, setVoiceList] = useState([]);
    const [voice, setVoice] = useState('');
    const spokenTextRef = useRef([]);
    spokenTextRef.current = text.split(' ').map((i, index) => spokenTextRef.current[index] ?? createRef())

    const handleSpeak = () => {
        let toSpeak = new SpeechSynthesisUtterance(text);
        toSpeak.voice = tts.getVoices().find(i => i.voiceURI === voice);
        spokenTextRef.current.map(i => {
            i.current.classList.remove('read-text')
        })
        toSpeak.onboundary = onBoundary;
        tts.speak(toSpeak);
    }

    const getVoices = () => {
        let interval;
        return new Promise((resolve, reject) => {
            interval = setInterval(() => {
                if (tts.getVoices().length > 0) {
                    resolve(tts.getVoices());
                    clearInterval(interval);
                }
            }, 10)
        })
    }

    const onBoundary = (event) => {
        const spokenText = event.utterance.text.substr(event.charIndex, event.charLength);
        const index = text.split(' ').findIndex(i => i === spokenText);
        if (index >= 0) {
            spokenTextRef.current[index].current.classList.add('read-text')
        }
    }

    useEffect(() => {
        getVoices().then(r => {
            setVoiceList(r);
        })
    }, [])

    return (
        <div className="space-y-5">
            <Header/>
            <div className="w-[500px] mx-auto border border-gray-300 p-5 rounded">
                <div className="space-y-3">
                    <select className="form-element" onChange={e => setVoice(e.target.value)}>
                        {voiceList.length > 0 && voiceList.map((i, index) => (
                            <option key={index} value={i.voiceURI}>{i.name}</option>
                        ))}
                    </select>
                    <textarea
                        className="form-element min-h-[120px]"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />

                    <div className="border border-indigo-500 p-2 min-h-[120px] rounded">
                        {text.split(' ').map((i, index) => (
                            <span ref={spokenTextRef.current[index]} key={index}>{i} </span>
                        ))}
                    </div>

                    <div>
                        <button className="h-10 px-3 bg-indigo-500 text-white w-full" onClick={() => handleSpeak()}>
                            Oxu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
