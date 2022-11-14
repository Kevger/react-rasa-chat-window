import "./chat.css";
import { Card, createStyles, Text } from "@mantine/core";
import useTextToSpeech from "./plugins/useTextToSpeech";
import ChatInput from "./Input";
import ChatMesssages from "./Messages";
import useRasa, { RasaStatus } from "react-rasa-hook";
import { useEffect, useState } from "react";
import ChatSettings from "./Settings";

const useStyles = createStyles((theme) => ({
  connecting: {
    position: "absolute",
    zIndex: 1000,
  },
}));


/**
 * Chat window react component for Rasa. Builds up on mantine. 
 * @param  {[(string) => void]} onUtterance A callback which will be called with the latest utterance of the bot. 
 * @param  {string} rasaServerUrl Address to the rasa webserver
 * @param  {string} rasaSocketPath Socket.io path of the rasa webserver. The default is /socket.io/
 * @return JSX.Element which represents the chat window component.
 */
export default function Chat({
  onUtterance,
  rasaServerUrl,
  rasaSocketPath,
}: {
  onUtterance?: (utterance: string) => void;
  rasaServerUrl: string;
  rasaSocketPath: string;
}) {
  const { classes } = useStyles();
  const { ttsState, voices, tts, setActiveVoice, activeVoice } =
    useTextToSpeech(0);
  const [muted, setMuted] = useState(false);
  const { status, history, utter } = useRasa(
    rasaServerUrl,
    rasaSocketPath,
    "/greet"
  );

  useEffect(() => {
    const lastMessage = history[history.length - 1];
    if (lastMessage?.text !== undefined && lastMessage?.received) {
      if (onUtterance) onUtterance(lastMessage.text);
      if (!muted) tts(lastMessage.text);
    }
  }, [history]);

  useEffect(() => {
    const bestVoice = voices.findIndex(
      (v) => v.lang === "de-DE" && v.name.includes("Google")
    );
    if (bestVoice === -1) return;
    setActiveVoice(bestVoice);
  }, [voices]);

  return (
    <Card shadow="sm" radius="md" p="md" withBorder>
      {status === RasaStatus.connecting && (
        <Text size="xl" className={classes.connecting}>
          Verbinde...
        </Text>
      )}
      <ChatSettings
        muted={muted}
        setMuted={setMuted}
        ttsState={ttsState}
        voices={voices}
        activeVoice={activeVoice}
        setActiveVoice={setActiveVoice}
      />
      <ChatMesssages
        history={history}
        waitingForResponse={status === RasaStatus.waitingForResponse}
      />
      <ChatInput onSubmit={utter} />
    </Card>
  );
}
