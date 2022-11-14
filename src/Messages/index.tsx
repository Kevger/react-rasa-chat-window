import { Button, ScrollArea, Stack, Image } from "@mantine/core";
import { useEffect, useRef } from "react";
import { Uploader } from "../../../Components/Uploader";
import ButtonsMessage from "./ButtonsMessage";
import TextMessage from "./TextMessage";
import { RasaMessage, RasaMessageType } from "../../../Plugins/useRasa";

function ChatWaitingAnimation() {
  return (
    <div
      className="dots"
      style={{ position: "absolute", zIndex: 1000, left: "2em", bottom: "1em" }}
    />
  );
}


export default function ChatMessages({
  history,
  waitingForResponse,
}: {
  history: RasaMessage[];
  waitingForResponse: boolean;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (viewport.current !== null) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history,waitingForResponse]);

  return (
    <ScrollArea
      style={{ height: "60vh" }}
      offsetScrollbars
      viewportRef={viewport}
    >
      <Stack style={{ padding: "10px" }}>
        {history.map((m) => {
          switch (m.type) {
            case RasaMessageType.text:
              return (
                !m.text?.startsWith("/") && (
                  <TextMessage message={m} key={m.id} />
                )
              );
            case RasaMessageType.attachment:
              return (
                <Image
                  width={"80%"}
                  onLoad={scrollToBottom}
                  src={m.attachment?.payload.src}
                  key={m.id}
                />
              );
            case RasaMessageType.quickReply:
              return <ButtonsMessage message={m} key={m.id} />;
            case RasaMessageType.uploader:
              return <Uploader key={m.id} />;
            default:
              throw new Error(`Invalid type ${m.type}`);
          }
        })}
        {waitingForResponse && <ChatWaitingAnimation />}
        <div id="chatwindow-autoscroll-anchor"/>
      </Stack>
    </ScrollArea>
  );
}
