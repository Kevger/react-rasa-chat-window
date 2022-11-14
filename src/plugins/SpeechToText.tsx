import React, { useEffect, useRef, useState } from "react";
import { IconMicrophone } from "@tabler/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ActionIcon, createStyles } from "@mantine/core";

const SENTENCE_END_LISTENING_DELAY_MS = 2000;
const useStyles = createStyles((theme) => ({
  microphone: {
    "&:hover": {
      color: "red",
      scale: "1.1",
    },
    pointerEvents: "all",
  },
}));

type SpeechToTextArgs = {
  onInput: (input: string) => void;
  onChange: (input: string) => void;
};

export default function SpeechToText({ onInput, onChange }: SpeechToTextArgs) {
  const [isActive, setActive] = useState(false);
  const { interimTranscript, finalTranscript, listening, resetTranscript } =
    useSpeechRecognition();
  const { classes } = useStyles();
  const timer = useRef<number | null>(null);
  const finalText = useRef<string>("");

  useEffect(() => {
    if (isActive) {
      onChange(finalText.current + " " + interimTranscript);
      if (timer.current && interimTranscript) {
        console.log("time out cleared", interimTranscript);
        clearTimeout(timer.current);
        timer.current = null;
      }

      if (finalTranscript !== "") {
        finalText.current = finalText.current + " " + finalTranscript;
        resetTranscript();
        // when the end of a sentence is recognized we restart the listening with
        // a timeout this is a bit hacky but seems like there is no other way
        // to wait x seconds after a sentence with the current webspeechapi
        setTimeout(() => {
          SpeechRecognition.startListening({ language: "de-DE" });
          timer.current = setTimeout(() => {
            SpeechRecognition.stopListening();
            onInput(finalText.current);
            finalText.current = "";
            timer.current = null;
            setActive(false);
          }, SENTENCE_END_LISTENING_DELAY_MS);
        }, 10);
      }
    }
  }, [onInput, onChange, isActive, interimTranscript, finalTranscript]);

  const toggleMicrophone = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isActive) {
      resetTranscript();
      SpeechRecognition.startListening({ language: "de-DE" });
    } else {
      SpeechRecognition.stopListening();
    }
    setActive(!isActive);
  };

  return (
    <ActionIcon
      type="button"
      onClick={toggleMicrophone}
      loading={listening}
      variant="transparent"
      className={classes.microphone}
    >
      <IconMicrophone size={25} stroke={1.5} />
    </ActionIcon>
  );
}
